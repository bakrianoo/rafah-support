const saveOptions = () => {
    // hide the .warning-section if it's visible
    const warningSection = document.querySelector('.warning-section');
    const successSection = document.querySelector('.success-section');

    // reset notification messages
    warningSection.style.display = 'none';
    successSection.style.display = 'none';
    warningSection.innerHTML = '';
    successSection.innerHTML = '';
    let errors = [];

    // collect options inputs
    const vectara_api_key = document.getElementById('opt-vectara-api-key').value;
    const anyscale_api_key = document.getElementById('opt-anyscale-api-key').value;
    const anyscale_llm_model = document.getElementById('opt-anyscale-llm-model').value;
    const platform_url = document.getElementById('opt-platform-url').value;
    const opt_support_platform_app = document.getElementById('opt-support-platform-app').value;
    
    // check if vectara_api_key is empty
    if(vectara_api_key == '') {
        errors.push('Vectara API Key is required');
    }

    // check if anyscale_api_key is empty
    if(anyscale_api_key == '') {
        errors.push('Anyscale API Key is required');
    }

    // check if platform_url is empty or not a valid url
    if(platform_url == '' || !Helpers.isValidURL(platform_url)) {
        errors.push('Platform URL is required and must be a valid URL');
    }

    // check if errors array is not empty
    if(errors.length > 0) {
        // show the errors
        let errors_html = `<div class="notification is-danger"><ul>`
        // make ul li elements for each error
        for(let i = 0; i < errors.length; i++) {
            errors_html += `<li>${errors[i]}</li>`;
        }
        errors_html += `</ul></div>`;

        warningSection.innerHTML = errors_html;
        warningSection.style.display = 'block';

        return;
    }

    chrome.storage.sync.set(
      { 
        vectara_api_key: vectara_api_key,
        anyscale_api_key: anyscale_api_key,
        anyscale_llm_model: anyscale_llm_model,
        support_platform_app: opt_support_platform_app,
        platform_url: platform_url,
      },
      () => {
        // Update status to let user know options were saved.
        setTimeout(() => {
            successSection.innerHTML = `<div class="notification is-success">Options saved.</div>`;
            successSection.style.display = 'block';
        }, 750);
      }
    );

    return;
};

// on document loaded
document.addEventListener('DOMContentLoaded', () => {
    // get the save button
    const saveButton = document.getElementById('save-options-btn');

    // add event listener to the save button
    saveButton.addEventListener('click', saveOptions);

    // get the vectara_api_key input
    const vectara_api_key = document.getElementById('opt-vectara-api-key');
    const anyscale_api_key = document.getElementById('opt-anyscale-api-key');
    const anyscale_llm_model = document.getElementById('opt-anyscale-llm-model');
    const platform_url = document.getElementById('opt-platform-url');
    const opt_support_platform_app = document.getElementById('opt-support-platform-app');

    // get the vectara_api_key from chrome storage
    chrome.storage.sync.get('vectara_api_key', (data) => {
        // check if vectara_api_key is not undefined
        if(data.vectara_api_key != undefined) {
            // set the vectara_api_key input value
            vectara_api_key.value = data.vectara_api_key;
        }
    });

    // get the anyscale_api_key from chrome storage
    chrome.storage.sync.get('anyscale_api_key', (data) => {
        // check if vectara_api_key is not undefined
        if(data.anyscale_api_key != undefined) {
            // set the vectara_api_key input value
            anyscale_api_key.value = data.anyscale_api_key;
        }
    });

    // get the anyscale_llm_model from chrome storage
    chrome.storage.sync.get('anyscale_llm_model', (data) => {
        // check if vectara_api_key is not undefined
        if(data.anyscale_llm_model != undefined) {
            // set the vectara_api_key input value
            anyscale_llm_model.value = data.anyscale_llm_model;
        } else {
            anyscale_llm_model.value = window.ANYSCALE_LLM_MODEL;
        }
    });

    // get the platform_url from chrome storage
    chrome.storage.sync.get('platform_url', (data) => {
        // check if vectara_api_key is not undefined
        if(data.platform_url != undefined) {
            // set the vectara_api_key input value
            document.getElementById('opt-platform-url').value = data.platform_url;
        }
    });

    // get the support_platform_app from chrome storage
    chrome.storage.sync.get('support_platform_app', (data) => {
        // check if vectara_api_key is not undefined
        if(data.support_platform_app != undefined) {
            // set the vectara_api_key input value
            document.getElementById('opt-support-platform-app').value = data.support_platform_app;
        }
    });
});
