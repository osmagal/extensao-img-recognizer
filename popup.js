// Botão para seleção do arquivo PDF.
document.querySelector(".file").addEventListener("change", async () => {

    document.querySelector("#loading").style.display = "flex";
    document.querySelector("#output").style.display = "none";

    // Abre o seletor de arquivos.
    const files = document.querySelector(".file").files;

    for (var i = 0; i <= files.length; i++){

        const file = document.querySelector(".file").files[i];
        const url = document.querySelector(".input").value;
        url.value = "";

        if (file) {

            let fr = new FileReader();
            fr.readAsDataURL(file);
            fr.onload = async function () {
                const b64 = fr.result.split("base64,")[1];
                const resp = await getResponseFromAPI({ content: b64, name: file.name, type: file.type });
                console.log(JSON.stringify(resp.retorno));
                // Exibe a resposta na tela.
                const output = document.getElementById("output");
                output.innerHTML = `${JSON.stringify(resp.retorno).trim()}`;
                if (resp == "Sim") {
                    console.log("Imagem: " + file.name + "\n" + resp.trim());
                }
                show();
            }
        } else {

            show();
            document.querySelector("#output").value = "Insira uma URL válida";
        }
    }
});

document.querySelector(".input").addEventListener("change", async () => {
    const url = document.querySelector(".input").value;
    document.querySelector(".file").value = "";
    const file = document.querySelector(".file");

    loading();
    file.value = "";

    if (url){

        await verificarArquivoPorURL(url).then(async informacoes => {
            const tipoArquivo = informacoes.tipo;
            const nomeArquivo = informacoes.nome;
        
            console.log('Tipo do arquivo:', tipoArquivo);
            console.log('Nome do arquivo:', nomeArquivo);

            let resp;
            const output = document.getElementById("output");
            loading();
            resp = await getResponseFromAPI({ url_file: url, type: tipoArquivo, name: nomeArquivo });
            output.innerHTML = `${resp}`;
            
            show();
          })
          .catch(error => {
            console.error('Erro ao verificar o arquivo:', error);
          });

    }else{
            
        document.querySelector("#loading").style.display = "none";
        document.querySelector("#output").style.display = "flex";
        document.querySelector("#output").value = "Insira uma URL válida";
    }
});

let docImg;
document.querySelector(".prompt").addEventListener("change", async () => {

    let prompt = await document.querySelector(".prompt").value;
    const file = document.querySelector(".file").files[0];
    const input = document.querySelector(".input").value;

    loading();

    let resp;
    const output = document.getElementById("output");

    if(file || input){

        docImg = "<b>Texto extraído de Documento/Imagem:</b>\n" + output.textContent;
        const promptInit = `
        Seu nome é JAOR, deve responder sempre em Português, 
        haja como um especialista em analisar imagens e textos,
        analise o Contexto para responder o usuário, 
        fique a vontade para melhorar as respostas. 
        Responda com conteúdo formatado com elementos HTML.
        Não precisa indicar com elementos limitadores.
        ${prompt}
        ${docImg}
        `;
        
        resp = await getResponseFromAPI({ prompt: promptInit });
 
        output.innerHTML = `
        <b>Você:</b>
        ${prompt}<br><br>
        <b>JAOR:</b>
        ${resp}<br><br>
        ${docImg}`;

    }else{
        resp = await getResponseFromAPI({ prompt: "JAOR responda em Português (Prompt Principal): " + prompt + docImg + "Contexto:" + output.outerText });
        
        output.innerHTML = `
        <b>Você:</b>
        ${prompt}<br><br>
        <b>JAOR:</b>
        ${resp}<br><br>
        ${output.innerHTML}`;
    }
    

    defaultFields();
    show();

});

function loading(){
    document.querySelector("#loading").style.display = "flex";
    document.querySelector("#output").style.display = "none";
}

function show(){
    document.querySelector("#loading").style.display = "none";
    document.querySelector("#output").style.display = "flex";
}

function defaultFields(){
    document.querySelector(".input").value = "";
    document.querySelector(".file").value = "";
    document.querySelector(".prompt").value = "";
}