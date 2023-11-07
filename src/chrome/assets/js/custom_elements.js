class CustomElements {
    static addSummaryButton(document, controllers){
        // append summary button to the controllers
        let summary_button_html = `<button type="submit" class="button summary-button smooth button--only-icon small secondary has-tooltip" data-original-title="Show emoji selector">Summary</button>`;
        let summary_button = document.createElement('button');
        summary_button.innerHTML = summary_button_html;

        // add event listener to the button
        summary_button.addEventListener('click', function() {
            Chatttings.getSummary(document);
        });

        // append summary button to the controllers
        controllers.appendChild(summary_button);

        return;
    }

    static getSummaryElement(summary_message){
        
        // get current datetime
        let current_datetime = new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true });
        
        // replace all new lines with <br>
        summary_message = summary_message.replace(/\n/g, '<br>');

        let new_message_html =  `
        <div class="wrap"><div class="bubble is-text"><div class="message-text__wrap hide--quoted"><div class="text-content">
            <span class="close-element">X</span>
            <p>
            ${summary_message}
            </p>
            </div> </div> <div class="message-text--metadata"><span data-v-65edd06c="" class="time">
                ${current_datetime}
            </span> </div></div> </div> <div class="context-menu-wrap"><div class="context-menu"><!----> <!----> <!----> <button data-v-222b00fd="" type="submit" class="button clear button--only-icon small secondary"><svg data-v-fcc3e4a2="" width="14" height="14" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="icon icon--font more-vertical"><path d="M12 7.75a1.75 1.75 0 1 1 0-3.5 1.75 1.75 0 0 1 0 3.5ZM12 13.75a1.75 1.75 0 1 1 0-3.5 1.75 1.75 0 0 1 0 3.5ZM10.25 18a1.75 1.75 0 1 0 3.5 0 1.75 1.75 0 0 0-3.5 0Z" fill="currentColor"></path></svg> </button> </div>
        </div>
        `

        // create a new element with this html
        let new_message = document.createElement('li');

        // add class to the new message (message--read ph-no-capture summary-message)
        new_message.classList.add('message--read');
        new_message.classList.add('ph-no-capture');
        new_message.classList.add('summary-message');
        new_message.classList.add('rafah-element');

        // add the html to the new message
        new_message.innerHTML = new_message_html;

        // add event listener to the close element button
        new_message.querySelector('.close-element').addEventListener('click', function(){
            // remove the element
            new_message.remove();
        });

        return new_message;
    }

    static addAIComposerSwitchElement(document, controllers){
        let ai_composer_switch_html = `
            <label class="ai-composer-switch">
                <input type="checkbox" id="ai-composer-checkbox">
                <span class="ai-composer-slider round"></span>
            </label>
        `;

        // create a new element with this html
        let ai_composer_switch = document.createElement('div');

        // add class to the new message (message--read ph-no-capture summary-message)
        ai_composer_switch.classList.add('ai-composer');
        ai_composer_switch.classList.add('rafah-element');

        // add event when checkbox is changed, store the value in local storage
        ai_composer_switch.addEventListener('change', function() {
            // get the checkbox
            let ai_composer_checkbox = document.querySelector('#ai-composer-checkbox');
            // store the checkbox value in the local storage
            localStorage.setItem('ai_composer_checkbox', ai_composer_checkbox.checked);
        });

        // add the html to the new message
        ai_composer_switch.innerHTML = ai_composer_switch_html;

        // restore the last status, if it was checked or not
        let is_checked = localStorage.getItem('ai_composer_checkbox');
        if(is_checked == 'true'){
            // change the input:checked to true
            ai_composer_switch.querySelector('input').setAttribute('checked', 'true');
        } else {
            ai_composer_switch.querySelector('input').removeAttribute('checked');
        }

        // append summary button to the controllers
        controllers.appendChild(ai_composer_switch);

        return;
    }
}