# **Como Criar uma Extensão para Chrome que Reconhece Imagens com IA**

## **Introdução à Extensão para Chrome**

Desenvolver uma extensão para o navegador Chrome que reconhece o conteúdo de imagens pode ser extremamente útil. Neste projeto, exploraremos como criar uma ferramenta que permite ao usuário selecionar uma imagem (ou fornecer uma URL) e utilizar o Gemini, a IA do Google, para identificar e descrever o que está na imagem.

---

## **Configuração Inicial do Seletor de Imagens**

O primeiro passo é permitir que o usuário selecione um arquivo de imagem. Utilizamos um elemento `<input type="file">` e capturamos o evento de mudança:

```javascript
document.querySelector(".file").addEventListener("change", async () => {
    const file = document.querySelector(".file").files[0];
    if (file) {
        let fr = new FileReader();
        fr.readAsDataURL(file);
        fr.onload = async function () {
            const b64 = fr.result.split("base64,")[1];
            const resp = await getResponseFromAPI({ content: b64, name: file.name, type: file.type });
            // Processamento da resposta...
        }
    }
});
```

Essa abordagem permite carregar imagens locais de forma simples.

---

## **Reconhecimento por URL**

Além de arquivos locais, a extensão também suporta a análise de imagens via URL direta:

```javascript
document.querySelector(".input").addEventListener("change", async () => {
    const url = document.querySelector(".input").value;
    if (url) {
        const resp = await getResponseFromAPI({ url_file: url });
        // Exibição do resultado...
    }
});
```

---

## **Integração com a IA Gemini (Backend Apps Script)**

A inteligência por trás do reconhecimento é processada por um script no Google Apps Script que faz a ponte com a API do Gemini:

```javascript
async function getResponseFromAPI(payload) {
    try {
        const url = "SEU_ENDPOINT_APPS_SCRIPT_AQUI";
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        return data.response || "Resposta não disponível";
    } catch (error) {
        console.error("Erro ao obter resposta:", error);
        return "Erro ao processar a solicitação";
    }
}
```

---

## **Interação via Chat (Prompt Dinâmico)**

A extensão permite que o usuário faça perguntas específicas sobre a imagem carregada, criando uma experiência interativa:

```javascript
document.querySelector(".prompt").addEventListener("change", async () => {
    let prompt = document.querySelector(".prompt").value;
    // Envia o prompt junto com o contexto da imagem para a IA
});
```

---

## **Configuração da URL da API / Backend**

No arquivo `get-response-api.js`, substitua o placeholder da URL pelo endpoint de implantação do seu Google Apps Script (ou backend equivalente com integração ao Gemini Vision):

```javascript
const url = "https://script.google.com/macros/s/SEU_APPS_SCRIPT_ID_AQUI/exec";
```

O arquivo `main.js` incluído no projeto contém o código base de exemplo para implantação no Google Apps Script. Substitua `SEU_APPS_SCRIPT_ID_AQUI` pela URL real obtida após implantar o Web App.

---

## **Conclusão**

Combinando a versatilidade das extensões do Chrome com a potência do Gemini, criamos uma ferramenta capaz de "enxergar" e explicar imagens. Este projeto demonstra o potencial da IA integrada diretamente no fluxo de navegação do usuário.

Explore as possibilidades de visão computacional e leve seu desenvolvimento para o próximo nível!
