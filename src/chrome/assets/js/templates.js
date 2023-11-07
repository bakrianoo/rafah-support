class Templates {
    static topicModelingTemplate(custom_message= "") {

        let messages = [

            {
                "role": "system",
                "content": "You are an NLU Engine for detecting the topic name. You can type `none` for unspecific message."
            },

            {"role": "user", "content": "I hope you good day. good bye"},
            {"role": "assistant", "content": "greetings"},

            {"role": "user", "content": "where are your branches?"},
            {"role": "assistant", "content": "branches-inquiry"},

            {"role": "user", "content": "my phone shipped broken, I need my money back"},
            {"role": "assistant", "content": "refund-inquiry"},

            {"role": "user", "content": "what the fuck is this"},
            {"role": "assistant", "content": "inappropriate-talking"},

            {"role": "user", "content": "tell me a joke"},
            {"role": "assistant", "content": "general-talking"},

            {"role": "user", "content": "Hello, How are you?"},
            {"role": "assistant", "content": "greetings"},

            {"role": "user", "content": "Can you provide more details about the material of the yoga mats listed on your website?"},
            {"role": "assistant", "content": "product-inquiry"},

            {"role": "user", "content": "I've received a damaged speaker, and I would like to know what can be done about this."},
            {"role": "assistant", "content": "product-complaint"},

            {"role": "user", "content": "My laptop has been overheating, can you help me troubleshoot this issue?"},
            {"role": "assistant", "content": "product-support"},

            {"role": "user", "content": "I placed an order last week and I haven't received a confirmation email, could you check my order status?"},
            {"role": "assistant", "content": "order-inquiry"},

            {"role": "user", "content": "It's been quite rainy this season, hasn't it?"},
            {"role": "assistant", "content": "general-talking"},

            {"role": "user", "content": `${custom_message}`},
        ]

        return messages;
    }

    static summarizationTemplate(messages_elements, max_summary_length = 100) {
        let messages = [
            {
                "role": "system", 
                "content": "You are an NLU Engine for summarizing a conversation between a Customer Support Agent (CSA) and a Customer (C).",
            },
        ]

        // iterate over all messages dom element and push the conversation to the messages array
        let conversation = [];
        for(var x in messages_elements){
            // check if class = 'left' is in the dom element
            if(messages_elements[x].classList && messages_elements[x].classList.contains('left')){
                // query the div.text-content of the message
                let message_text = messages_elements[x].querySelector('div.text-content p');

                // extract a topic for the message
                let dom_text = message_text.innerText;
                conversation.push(`- (C): ${dom_text}`);
            } else if (messages_elements[x].classList && messages_elements[x].classList.contains('right')) {
                // query the div.text-content of the message
                let message_text = messages_elements[x].querySelector('div.text-content p');

                // extract a topic for the message
                let dom_text = message_text.innerText;
                conversation.push(`- (CSA): ${dom_text}`);
            }
        }

        // task description
        conversation.push([
            "\nSummarization Request:",
            `\n\nPlease provide a brief summary of the above conversation.`,
            "Ensure that the summary is concise and accurately reflects the key points of the dialogue without introducing any information that was not mentioned by the participants.",
            "If the question is not answerable, please mentioned `the customer did not get a response yet` in uppercase letters. do not try to generate non existed response.",
            `The summry should not exceed ${max_summary_length} words.`,
            "Your summary must be short and concise, and it should not contain any unnecessary information.",
            "The summary should contain at the end a section called (Unresponded Messages) that contains all messages that the customer did not get a response yet.",
            "Do not start with any introductory phrases such as 'The following is a conversation between...' or 'Sure, I'd be happy to help you with that ..'.`",
            "\n\n",
        ].join(" "))


        messages.push({"role": "user", "content": conversation.join('\n')});
        return messages;
    }
}