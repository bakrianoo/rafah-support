// Autor: Abu Bakr Soliman
// Date: 04-11-2023
// Description: This file is responsible for the chatting functionality

class Chatttings {

    // function to get the summary
    static getSummary() {
        console.log(LOG_PREFIX + 'Preparing the summary...');
    }

    // get anyscale LLM response
    static get_anyscale_response(messages){

        const url = window.ANYSCALE_API_ENDPOINT + '/chat/completions';

        const payload = {
            "model": (window.anyscale_llm_model != undefined) ? window.anyscale_llm_model : window.ANYSCALE_LLM_MODEL,
            "messages": messages,
            "temperature": window.ANYSCALE_LLM_TEMPERATURE
        };

        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${window.anyscale_api_key}`
        };

        fetch(url, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(payload)
        })
        .then(response => response.json())
        .then(data => {
            // check if data has choices
            if(data.choices != undefined) {
                // get the first choice
                let choice = data.choices[0];

                // check if choice has text
                if(choice.message != undefined) {
                    console.log(choice.message.content);
                }
            }
            
        })
        .catch((error) => console.error('Error:', error));

    }
}
