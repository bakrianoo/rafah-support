class CustomObservers {
    static initObserver(){
        return new MutationObserver(async () => {
            const url = location.href;
            if (url !== lastUrl) {
              lastUrl = url;
              
              if(Helpers.isTargetedURL(url)) {
                  // launch the extension
                  // initial checking for the current url
                    setTimeout(async function(){
                        // launch the extension
                        let _ = await launchExtension(url);
                    }, 2000);
              }
            }
          });
    }

    static newElementsObserver(){
        return new MutationObserver(async function(mutations) {
            // iterate over all mutations
            // check if the mutation is for new node added with class = '.message--read'

            
            
            for (var i = 0; i < mutations.length; i++) {
                for (var j = 0; j < mutations[i].addedNodes.length; j++) {
                    if(mutations[i].addedNodes[j].classList && mutations[i].addedNodes[j].classList.contains('message--read')){
        
                        // if the element class list contains rafah-element, then skip it
                        if(mutations[i].addedNodes[j].classList.contains('rafah-element')){
                            continue;
                        }
        
                        // get key for the current tab_url
                        let tab_key = null;
                        let ai_composer_checkbox = document.querySelector('#ai-composer-checkbox');
        
                        let conversation_id_key_selector = ".button__content span.leading-tight"
                        if(document.querySelector(conversation_id_key_selector)){
                            tab_key = document.querySelector(conversation_id_key_selector).innerText;
                            // remove all spaces from the key
                            tab_key = tab_key.replace(/\s/g, '');
                        }
        
                        let _ = await Chatttings.getMessagesTopicModeling([mutations[i].addedNodes[j]], tab_key)

                        // check the current element id
                        let current_element_id = mutations[i].addedNodes[j].id;
                        if(current_element_id){
                            // extract the number from the id
                            current_element_id = current_element_id.replace(/\D/g,'');
                        }
                        // parse to int if applicable
                        if(current_element_id && !isNaN(current_element_id)){
                            current_element_id = parseInt(current_element_id);
                        } else {
                            current_element_id = -100;
                        }

                        // check if ai_composer_checkbox is checked and it's a new message
                        if(     ai_composer_checkbox && 
                                ai_composer_checkbox.checked &&
                                mutations[i].addedNodes[j].classList && 
                                mutations[i].addedNodes[j].classList.contains('left') &&
                                current_element_id > window.LAST_MESSAGE_ID
                            ){
                            
                            let user_message = mutations[i].addedNodes[j].innerText;
                            let requires_resources = false;

                            // get button.topic-name-tag element in mutations[i].addedNodes[j]
                            let requires_resources_value = mutations[i].addedNodes[j].getAttribute('data-requires_resources');
                            if(requires_resources_value && requires_resources_value.length > 0 && requires_resources_value == '1'){
                                requires_resources = true;
                            }
                            
                            // remove some unwanted text from the message
                            let topic_buttons = document.querySelectorAll('button.topic-name-tag');
                            if(topic_buttons){
                                // remove topic name from the message
                                for(var x in topic_buttons){
                                    if(topic_buttons[x].innerText){
                                        user_message = user_message.replace(topic_buttons[x].innerText, '');
                                    }
                                }
                            }

                            let timestamp = mutations[i].addedNodes[j].querySelector('.message-text--metadata');
                            if(timestamp){
                                // remove timestamp from the message
                                user_message = user_message.replace(timestamp.innerText, '');
                            }

                            // compose message
                            let _ = await Chatttings.composeMessage(document, user_message.trim(), requires_resources, mutations[i].addedNodes[j]);

                            window.LAST_MESSAGE_ID = current_element_id;
                        }
                    }
                }
            }
         });
    }
}