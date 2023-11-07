// Autor: Abu Bakr Soliman
// Date: 04-11-2023
// Description: This file is responsible for the chatting functionality

class Chatttings {
    // get anyscale LLM response
    static async get_anyscale_response(messages, temperature = null, cut_intro=false){

        const url = window.ANYSCALE_API_ENDPOINT + '/chat/completions';

        const payload = {
            "model": (window.anyscale_llm_model != undefined) ? window.anyscale_llm_model : window.ANYSCALE_LLM_MODEL,
            "messages": messages,
            "temperature": (temperature != null) ? temperature : window.ANYSCALE_LLM_TEMPERATURE,
        };

        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${window.ANYSCALE_API_KEY}`
        };

        // using axios, send a POST JSON request
        let response = await axios.post(url, payload, {headers: headers})

        if(response.status == 200 && response.data != undefined && response.data.choices != undefined){
            let cleaned_message = response.data.choices[0].message.content;

            if(cut_intro){
                // split by \n\n
                let split_message = cleaned_message.split('\n\n');
                if(split_message.length > 1){
                    // remove the first element
                    split_message.shift();
                    // join the array again
                    cleaned_message = split_message.join('\n\n').trim();
                }
            }

            // remove any " in the beginning and end of the message
            cleaned_message = cleaned_message.replace(/^"/g, "");
            cleaned_message = cleaned_message.replace(/"$/g, "");

            return cleaned_message.trim();
        }

        return null;
    }

    // retrieve cached response from local storage
    static async  getCachedResponse(key){
        return localStorage.getItem(key);
    }

    // store response in local storage
    static async storeResponse(key, response){
        // store the response in the local storage
        localStorage.setItem(key, response);
        return true;
    }

    // function to get the summary
    static async getSummary(document, temperature = 0.7) {
        
        Helpers.showLoaderSpinner(document);

        // get the messages list
        let messages_list = document.querySelector('ul.conversation-panel');
        if(!messages_list){
            Helpers.hideLoaderSpinner(document);
            return null;
        }

        let messages = await Templates.summarizationTemplate(document.querySelectorAll('.message--read'));
        let response = await this.get_anyscale_response(messages, temperature);

        if(!response || response.length == 0){
            Helpers.hideLoaderSpinner(document);
            return null;
        }
        
        let new_message_element = CustomElements.getSummaryElement(response);

        // append the new message to the messages list
        messages_list.appendChild(new_message_element);

        // scroll to the new message
        new_message_element.scrollIntoView();

        Helpers.hideLoaderSpinner(document);
    }

    // compose response to a customer message
    static async composeMessage(document, message_text, temperature = 0.5) {

        Helpers.showLoaderSpinner(document);

        // get the messages list
        let messages_list = document.querySelector('ul.conversation-panel');
        if(!messages_list){
            Helpers.hideLoaderSpinner(document);
            return null;
        }

        let messages = await Templates.aiComposerTemplate(document.querySelectorAll('.message--read'));
        let response = await this.get_anyscale_response(messages, temperature, true);

        if(!response || response.length == 0){
            Helpers.hideLoaderSpinner(document);
            return null;
        }

        // get div.ProseMirror-woot-style element
        let composer = document.querySelector('div.ProseMirror-woot-style');

        // set the inner text of the composer
        composer.innerText = response.trim();
        Helpers.hideLoaderSpinner(document);
    }

    // function to generate topic modeling of messages
    static async getMessagesTopicModeling(messages, tab_key, default_topic_name = 'general-talking'){
        // iterate over all messages dom element
        for(var x in messages){
            
            // check if class = 'left' is in the dom element
            if(messages[x].classList && messages[x].classList.contains('left')){
                // query the div.text-content of the message
                let message_text = messages[x].querySelector('div.text-content p');

                // extract a topic for the message
                let dom_text = message_text.innerText;

                let message_key = await this.getMessageKey(tab_key, dom_text);
                let response = await this.getCachedResponse(message_key);

                if(!response){
                    let messsages = Templates.topicModelingTemplate(dom_text)
                    response = await this.get_anyscale_response(messsages);

                    // store the response in the local storage
                    let _ = await this.storeResponse(message_key, response);
                    
                    // parse the json reponse
                    try{
                        response = JSON.parse(response.trim());
                    } catch(e){
                        console.log("Error parsing response:", response)
                        continue;
                    }
                } else {
                    try{
                        response = JSON.parse(response.trim());
                    } catch(e){
                        console.log("Error parsing response:", response)
                        continue;
                    }
                }

                // create button element
                let button = document.createElement('button');
                button.classList.add('topic-name-tag');
                button.classList.add('button');

                // if response not empty and the strip only contains one word
                if(response != null && response.topic && response.topic.length > 0){
                    // set the button text
                    button.innerText = response.topic.trim();
                    // append the button to the message
                    message_text.appendChild(button);
                    // add data-requires_resources attribute
                    button.setAttribute('data-requires_resources', response.requires_resources);
                } else {
                    // set the button text
                    button.innerText = default_topic_name;
                    // append the button to the message
                    message_text.appendChild(button);
                }
            }  
        }
    }

    static async isRequiringResources(user_message){

        let messages = await Templates.isRequiringResourcesTemplate(user_message);
        let response = await this.get_anyscale_response(messages);

        console.log("0-1 response:", response)
    }

    static async getMessageKey(tab_key, message_text){
        let message_key = `${tab_key}-${message_text}}`
        // keep only alphanumeric and - characters
        return message_key.replace(/[^a-zA-Z0-9-]/g, '');
    }
}
