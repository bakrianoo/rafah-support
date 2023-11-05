// Autor: Abu Bakr Soliman
// Date: 04-11-2023
// Description: This file is for content scripts of the live support page

// wait until page is loaded
window.onload = function(){
    
    window.vectara_api_key = null;
    window.anyscale_api_key = null;

    // get the vectara_api_key from chrome storage
    chrome.storage.sync.get('vectara_api_key', (data) => {
        // check if vectara_api_key is not undefined
        if(data.vectara_api_key != undefined) {
            // set the vectara_api_key input value
            window.vectara_api_key = data.vectara_api_key;
        }
    });

    // get the anyscale_api_key from chrome storage
    chrome.storage.sync.get('anyscale_api_key', (data) => {
        // check if vectara_api_key is not undefined
        if(data.anyscale_api_key != undefined) {
            // set the vectara_api_key input value
            window.anyscale_api_key = data.anyscale_api_key;
        }
    });

    // get the anyscale_llm_model from chrome storage
    chrome.storage.sync.get('anyscale_llm_model', (data) => {
        // check if vectara_api_key is not undefined
        if(data.anyscale_llm_model != undefined) {
            // set the vectara_api_key input value
            window.anyscale_llm_model = data.anyscale_llm_model;
        }
    });
    
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

}

let lastUrl = location.href; 
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    onUrlChange();
  }
}).observe(document, {subtree: true, childList: true});

function onUrlChange() {
  console.log('URL changed!', location);
}

Helpers.rlog('Starting Rafah AI Support');