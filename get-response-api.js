async function getResponseFromAPI(file) {
    try {
        // Substitua pela URL de implantação do seu Google Apps Script (Web App)
        const url = "https://script.google.com/macros/s/SEU_APPS_SCRIPT_ID_AQUI/exec";

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                file: file.content,
                name: file.name,
                type: file.type,
                url: file.url_file,
                prompt: file.prompt
            })
        });

        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status}`);
        }

        // Converte a resposta para JSON.
        const data = await response.json();

        // Exibe o resultado no console.
        //console.log("Resposta da API:", data.response);

        // Retorna o JSON no formato desejado.
        return data.response || "Resposta não disponível"

    } catch (error) {
        console.error("Erro ao obter resposta do servidor:", error);
        return { error: error.message };
    }
}