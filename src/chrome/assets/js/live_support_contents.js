// Autor: Abu Bakr Soliman
// Date: 04-11-2023
// Description: This file is for content scripts of the live support page

// wait until page is loaded
function launchExtension(tab_url){

    Helpers.rlog('Starting in:', tab_url);

    window.vectara_api_key = null;
    window.anyscale_api_key = null;
    
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


window.onload = function(){
    // load the storage options
    Helpers.loadStorageOptions();

    // initial checking for the current url
    setTimeout(function(){
        if(Helpers.isTargetedURL(location.href)) {
            // launch the extension
            launchExtension(location.href);
        }
    }, 1000);
}


// run observer to check any changes in the url
var lastUrl = null;
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    
    if(Helpers.isTargetedURL(url)) {
        // launch the extension
        launchExtension(url);
    }
  }
}).observe(document, {subtree: true, childList: true});
