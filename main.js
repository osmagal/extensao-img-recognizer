function doPost(req) {
  return run(req);
}

function resizeImage(imageBlob, newWidth) {
  var image = Image.create(imageBlob);
  var originalWidth = image.getWidth();
  var originalHeight = image.getHeight();

  // Calcula a nova altura mantendo a proporção
  var newHeight = Math.round(originalHeight * newWidth / originalWidth);

  // Redimensiona a imagem
  image.setWidth(newWidth);
  image.setHeight(newHeight);

  return image;
}

async function run(req) {
  try {

    // Analisa os dados recebidos do pedido POST
    let data = JSON.parse(req.postData.contents);
    let fileName = data.name;
    let typeFile = data.type;
    let decodedData;
    let textReturn;

    if (data.url) {
      const url = data.url;
      const response = UrlFetchApp.fetch(data.url);
      let file = response.getBlob();

      // Extrair o MIME Type da header "Content-Type"
      const contentTypeHeader = response.getHeaders()['Content-Type'];
      typeFile = contentTypeHeader.split(';')[0];

      if (typeFile.includes("image")) {
        const lastSlashIndex = url.lastIndexOf('/');
        fileName = url.substring(lastSlashIndex + 1);
        file = resizeImage(file, 1000);
      } else {
        // Extrair o nome do arquivo da header "Content-Disposition" (se disponível)
        const contentDispositionHeader = response.getHeaders()['Content-Disposition'];
        fileName = null;
        if (contentDispositionHeader) {
          const parts = contentDispositionHeader.split(';');
          for (let part of parts) {
            const [key, value] = part.split('=');
            if (key.trim().toLowerCase() === 'filename') {
              fileName = value.replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1'); // Remover aspas
              break;
            }
          }
        }
      }

      Logger.log(fileName);
      Logger.log(typeFile);

      decodedData = file.getBytes();
      //Logger.log(decodedData);

      textReturn = await getTextDocument(decodedData, typeFile, fileName);

    } else if (data.prompt) {

      textReturn = await GM(data.prompt);
      Logger.log('O tipo de ret é: ' + typeof textReturn);

    } else {

      decodedData = Utilities.base64Decode(data.file);
      textReturn = await getTextDocument(decodedData, typeFile, fileName);

    }

    Logger.log(textReturn);
    // Retorna o texto extraído como resposta
    var result = {
      output: textReturn
    };
    return ContentService.createTextOutput(String(result));

  } catch (err) {
    // Retorna o erro como resposta em caso de falha
    return ContentService.createTextOutput(err);
  }
}

async function getTextDocument(decodedData, typeFile, fileName) {
  // Cria um novo blob com os dados decodificados
  let blob = await Utilities.newBlob(decodedData, typeFile, fileName);

  const file = {
    name: fileName,
    mimeType: typeFile
  }

  // Insere o arquivo no Google Drive e armazena o ID do arquivo
  let insert = await Drive.Files.insert(file, blob, { ocr: true });

  // Abre o arquivo como um documento do Google Docs e obtém seu conteúdo como texto
  let text = await DocumentApp.openByUrl(insert.embedLink).getBody().getText();

  //Logger.log(text);

  // Remove o arquivo do Google Drive após o processamento
  Drive.Files.remove(insert.id);

  return text;
}