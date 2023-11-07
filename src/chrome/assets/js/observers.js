class CustomObservers {
    static initObserver(){
        return new MutationObserver(async () => {
            const url = location.href;
            if (url !== lastUrl) {
              lastUrl = url;
              
              if(Helpers.isTargetedURL(url)) {
                  // launch the extension
                  let _ = await launchExtension(url);
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
        
                        let conversation_id_key_selector = ".button__content span.leading-tight"
                        if(document.querySelector(conversation_id_key_selector)){
                            tab_key = document.querySelector(conversation_id_key_selector).innerText;
                            // remove all spaces from the key
                            tab_key = tab_key.replace(/\s/g, '');
                        }
        
                        let _ = await Chatttings.getMessagesTopicModeling([mutations[i].addedNodes[j]], tab_key)
                    }
                }
            }
         });
    }
}