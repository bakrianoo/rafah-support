// Autor: Abu Bakr Soliman
// Date: 04-11-2023
// Description: This file contains a set of helper functions

// create class for helper functions
class Helpers {
    // function to get the current date
    static getCurrentDate() {
        let date = new Date();
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();

        return `${day}-${month}-${year}`;
    }

    // function to get the current time
    static getCurrentTime() {
        let date = new Date();
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let seconds = date.getSeconds();

        return `${hours}:${minutes}:${seconds}`;
    }

    static isValidURL(string) {
        try {
          new URL(string);
        } catch (_) {
          return false;  
        }
      
        return true;
    }

    static isTargetedURL(current_url){

      let matching_patterns = [
        "/app/accounts/*/conversations/*"
      ];

      let platform_url = window.PLATFORM_URL;

      // parse and get domain and path values
      current_url = new URL(current_url);
      let domain = current_url.hostname;
      let path = current_url.pathname;

      // check if platform_url is not empty and is a valid url
      if(platform_url != '' && Helpers.isValidURL(platform_url)) {
        // check if the current url is a part of the platform_url
        if(platform_url.includes(domain)) {
          // check if path is matching any of the matching_patterns
          return matching_patterns.some(pattern => {
            // Convert wildcard pattern to a regular expression
            const regex = new RegExp('^' + pattern.split('*').map(part => this.escapeRegExp(part)).join('.*') + '$');
            // Test the new_value against the regex
            return regex.test(path);
          });
        }
      }

      return false;
    }

    static loadStorageOptions() {
      // get the vectara_api_key from chrome storage
        chrome.storage.sync.get('vectara_api_key', (data) => {
          // check if vectara_api_key is not undefined
          if(data.vectara_api_key != undefined) {
              // set the vectara_api_key input value
              window.VECTARA_API_KEY = data.vectara_api_key;
          }
       });

       // get opt_vectara_customer_id from chrome storage
        chrome.storage.sync.get('opt_vectara_customer_id', (data) => {
          // check if vectara_api_key is not undefined
          if(data['opt_vectara_customer_id'] != undefined) {
              // set the vectara_api_key input value
              window.VECTARA_CUSTOMER_ID = data['opt_vectara_customer_id'];
          }
        });

        // get opt_vectara_corpus_id from chrome storage
        chrome.storage.sync.get('opt_vectara_corpus_id', (data) => {
          // check if vectara_api_key is not undefined
          if(data['opt_vectara_corpus_id'] != undefined) {
              // set the vectara_api_key input value
              window.VECTARA_CORPUS_ID = data['opt_vectara_corpus_id'];
          }
        });

       chrome.storage.sync.get('anyscale_api_key', (data) => {
        // check if vectara_api_key is not undefined
        if(data.anyscale_api_key != undefined) {
            // set the vectara_api_key input value
            window.ANYSCALE_API_KEY = data.anyscale_api_key;
        }
      });
      
      chrome.storage.sync.get('anyscale_llm_model', (data) => {
        // check if vectara_api_key is not undefined
        if(data.anyscale_llm_model != undefined) {
            // set the vectara_api_key input value
            window.ANYSCALE_LLM_MODEL = data.anyscale_llm_model;
        }
      });

      chrome.storage.sync.get('platform_url', (data) => {
        // check if vectara_api_key is not undefined
        if(data.platform_url != undefined) {
            // set the vectara_api_key input value
            window.PLATFORM_URL = data.platform_url;
        }
      });

    }

    // function to use a custom log
    static rlog(...args) {
        // append LOG_PREFIX to the arguments at the beginning
          args.unshift(window.LOG_PREFIX);
          console.log(...args);
          return;
    }
    // function to escape special characters in a string
    static escapeRegExp(string) {
      // Use a RegExp to escape special characters for regular expression
      return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    // function to add full page loader to the document
    static appendPageLoader(document) {
      let loader_html = `
          <div class="loader">
              <img src="https://cdnjs.cloudflare.com/ajax/libs/galleriffic/2.0.1/css/loader.gif" alt="Rafah Support..." />
              <p class="loader-message">Please wait, Rafah is preparing the content...</p>
              <span class="close-spinner">X</span>
          </div>
      `;

      let loader = document.createElement('div');
      loader.classList.add('loader-container');
      loader.innerHTML = loader_html;

      // add onclick event to the close spinner button
      loader.querySelector('.close-spinner').addEventListener('click', function(){
        // hide the loader
        Helpers.hideLoaderSpinner(document);
      });

      // append loader to the document <body> tag in the start
      let body = document.querySelector('body');
      body.insertBefore(loader, body.firstChild);
    }

    // function to add full page overlay to preview the documents
    static appendDocsViewer(document) {
      let loader_html = `
          <div class="loader">
              <div class="vertica-docs-list"></div>
              <span class="close-previewer">X</span>
          </div>
      `;

      let loader = document.createElement('div');
      loader.classList.add('preview-container');
      loader.innerHTML = loader_html;

      // add onclick event to the close spinner button
      loader.querySelector('.close-previewer').addEventListener('click', function(){
        // hide the loader
        Helpers.hideDocsPreviewer(document);
      });

      // append loader to the document <body> tag in the start
      let body = document.querySelector('body');
      body.insertBefore(loader, body.firstChild);
    }

    // toggle loader spinner
    static toggleLoaderSpinner(document) {
      // toggle the display of the loader to be none or flex
      document.querySelector('.loader-container').style.display = loader.style.display == 'none' ? 'flex' : 'none';
    }

    // hide loader spinner
    static hideLoaderSpinner(document) {
      document.querySelector('.loader-container').style.display = 'none';
    }

    // show loader spinner
    static showLoaderSpinner(document) {
      document.querySelector('.loader-container').style.display = 'flex';
    }

    // hide docs previewer
    static hideDocsPreviewer(document) {
      document.querySelector('.preview-container').style.display = 'none';
    }

    // show docs previewer
    static showDocsPreviewer(document) {
      document.querySelector('.preview-container').style.display = 'flex';
    }

    // get the tab key
    static getTabKey(document) {

      let conversation_id_key_selector = ".button__content span.leading-tight"

      if(document.querySelector(conversation_id_key_selector)){
          let tab_key = document.querySelector(conversation_id_key_selector).innerText;
          // remove all spaces from the key
          return tab_key.replace(/\s/g, '');
      }

      return null;
    }

    // get message key
    static async getMessageKey(message_text) {
      // remove all spaces from the key
      message_text = message_text.replace(/\s/g, '');

      // remove any special characters
      message_text = message_text.replace(/[^\w\s]/gi, '');

      // lower case the key
      return message_text.replace(/\s/g, '').toLowerCase();
    }
}


