// Autor: Abu Bakr Soliman
// Date: 04-11-2023
// Description: This file is for content scripts of the live support page

// messages queue
var messages_queue = [];

// new message observer
var messages_observer = CustomObservers.newElementsObserver();

// wait until page is loaded
async function launchExtension(tab_url){

    // welcome message
    Helpers.rlog('Starting in:', tab_url);

    // append page loader
    Helpers.appendPageLoader(document);

    // append document viewer
    Helpers.appendDocsViewer(document);

    // get key for the current tab_url
    let tab_key = Helpers.getTabKey(document);

    // collect all elements of .message--read
    let all_messages = document.querySelectorAll('.message--read');
    if(all_messages == null || all_messages.length > 0){
        // store last message id
        window.LAST_MESSAGE_ID = all_messages[all_messages.length - 1].id;
        
        if(window.LAST_MESSAGE_ID){
            // extract the number from the id
            window.LAST_MESSAGE_ID = window.LAST_MESSAGE_ID.replace(/\D/g,'');
        }

        if(window.LAST_MESSAGE_ID && !isNaN(window.LAST_MESSAGE_ID)){
            window.LAST_MESSAGE_ID = parseInt(window.LAST_MESSAGE_ID);
        } else {
            window.LAST_MESSAGE_ID = -1;
        }
    }

    // run topic modeling on all messages
    let _ = await Chatttings.getMessagesTopicModeling(all_messages, tab_key)

    // get panel-footer controllers buttons
    let controllers_selector = 'div.bottom-box > div.left-wrap';

    // if the controllers are not loaded yet, wait 0.5 second and try again
    if(document.querySelector(controllers_selector) == null) {
        setTimeout(function(){window.onload();}, 500);
        return;
    }

    // get chat box controllers
    let controllers = document.querySelector(controllers_selector);

    // append new elements to the controllers
    // 1. summary button
    CustomElements.addSummaryButton(document, controllers);

    // 2. AI Composer Switch
    CustomElements.addAIComposerSwitchElement(document, controllers);

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
    }, 2000);
}


// run observer to check any changes in the url
var lastUrl = null;
CustomObservers.initObserver().observe(document, {subtree: true, childList: true});
