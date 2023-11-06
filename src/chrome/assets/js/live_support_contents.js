// Autor: Abu Bakr Soliman
// Date: 04-11-2023
// Description: This file is for content scripts of the live support page

// messages queue
var messages_queue = [];

// new message observer
var messages_observer = new MutationObserver(async function(mutations) {
    // iterate over all mutations
    // check if the mutation is for new node added with class = '.message--read'
    for (var i = 0; i < mutations.length; i++) {
        for (var j = 0; j < mutations[i].addedNodes.length; j++) {
            if(mutations[i].addedNodes[j].classList && mutations[i].addedNodes[j].classList.contains('message--read')){
                console.log('New message added');
                // get key for the current tab_url
                let tab_key = null;

                let conversation_id_key_selector = ".button__content span.leading-tight"
                if(document.querySelector(conversation_id_key_selector)){
                    tab_key = document.querySelector(conversation_id_key_selector).innerText;
                    // remove all spaces from the key
                    tab_key = tab_key.replace(/\s/g, '');
                }

                // collect all elements of .message--read
                // let all_messages = document.querySelectorAll('.message--read');

                let _ = await Chatttings.getMessagesTopicModeling([mutations[i].addedNodes[j]], tab_key)
            }
        }
    }
 });

// wait until page is loaded
async function launchExtension(tab_url){

    Helpers.rlog('Starting in:', tab_url);

    // get key for the current tab_url
    let tab_key = null;

    let conversation_id_key_selector = ".button__content span.leading-tight"
    if(document.querySelector(conversation_id_key_selector)){
        tab_key = document.querySelector(conversation_id_key_selector).innerText;
        // remove all spaces from the key
        tab_key = tab_key.replace(/\s/g, '');
    }

    // collect all elements of .message--read
    let all_messages = document.querySelectorAll('.message--read');

    let _ = await Chatttings.getMessagesTopicModeling(all_messages, tab_key)

    // get panel-footer controllers buttons
    let controllers_selector = 'div.bottom-box > div.left-wrap';

    // if the controllers are not loaded yet, wait 0.5 second and try again
    if(document.querySelector(controllers_selector) == null) {
        setTimeout(function(){window.onload();}, 500);
        return;
    }

    // chat box controllers
    let controllers = document.querySelector(controllers_selector);

    // append summary button to the controllers
    let summary_button_html = `<button data-v-5b769a38="" type="submit" class="button smooth button--only-icon small secondary has-tooltip" data-original-title="Show emoji selector">Summary</button>`;
    let summary_button = document.createElement('button');
    summary_button.innerHTML = summary_button_html;

    // add event listener to the button
    summary_button.addEventListener('click', function() {
        Chatttings.get_anyscale_response();
    });

    // append summary button to the controllers
    controllers.appendChild(summary_button);

    // run observer to check any changes in the messages
     
    messages_observer.observe(document, {attributes: false, childList: true, characterData: false, subtree:true});
}


window.onload = async function(){
    // load the storage options
    Helpers.loadStorageOptions();

    // initial checking for the current url
    setTimeout(async function(){
        if(Helpers.isTargetedURL(location.href)) {
            // launch the extension
            let _ = await launchExtension(location.href);
        }
    }, 3000);
}


// run observer to check any changes in the url
var lastUrl = null;
new MutationObserver(async () => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    
    if(Helpers.isTargetedURL(url)) {
        // launch the extension
        let _ = await launchExtension(url);
    }
  }
}).observe(document, {subtree: true, childList: true});


 
