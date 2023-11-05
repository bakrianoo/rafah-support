
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
    
    // check if vectara_api_key is empty
    if(vectara_api_key == '') {
        errors.push('Vectara API Key is required');
    }

    // check if anyscale_api_key is empty
    if(anyscale_api_key == '') {
        errors.push('Anyscale API Key is required');
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
        anyscale_api_key: anyscale_api_key
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
});
