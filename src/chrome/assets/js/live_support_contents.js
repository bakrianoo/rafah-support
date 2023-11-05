// Autor: Abu Bakr Soliman
// Date: 04-11-2023
// Description: This file is for content scripts of the live support page

// wait until page is loaded
window.onload = function(){    
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
        Chatttings.getSummary();
    });

    // append summary button to the controllers
    controllers.appendChild(summary_button);
}

Helpers.rlog('Starting Rafah AI Support');