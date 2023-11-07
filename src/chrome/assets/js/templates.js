class Templates {
    static topicModelingTemplate(custom_message= "") {

        let messages = [

            {
                "role": "system",
                "content": [
                    "You are an NLU Engine for detecting the topic name and classify the message to be from 0 or 1.",
                    "You can type `none` for unspecific topic name.",
                    "requires_resources will be `1` if the customer support will need to look into some documents or resources to answer the question.",
                    "requires_resources will be `0` if the customer support can answer the question without looking into any documents or resources.",
                ].join("\n")
            },

            {"role": "user", "content": "I hope you good day. good bye"},
            {"role": "assistant", "content": '{"topic": "greetings", "requires_resources": 0}'},

            {"role": "user", "content": "where are your branches?"},
            {"role": "assistant", "content": '{"topic": "branches-inquiry", "requires_resources": 1}'},

            {"role": "user", "content": "my phone shipped broken, I need my money back"},
            {"role": "assistant", "content": '{"topic": "refund-inquiry", "requires_resources": 0}'},

            {"role": "user", "content": "what the fuck is this"},
            {"role": "assistant", "content": '{"topic": "inappropriate-talking", "requires_resources": 0}'},

            {"role": "user", "content": "tell me a joke"},
            {"role": "assistant", "content": '{"topic": "general-talking", "requires_resources": 0}'},

            {"role": "user", "content": "Hello, How are you?"},
            {"role": "assistant", "content": '{"topic": "greetings", "requires_resources": 0}'},
            
            {"role": "user", "content": "Is there any color other than white for this laptop?"},
            {"role": "assistant", "content": '{"topic": "product-search", "requires_resources": 1}'},

            {"role": "user", "content": "Can you provide more details about the material of the yoga mats listed on your website?"},
            {"role": "assistant", "content":  '{"topic": "product-inquiry", "requires_resources": 0}'},

            {"role": "user", "content": "I've received a damaged speaker, and I would like to know what can be done about this."},
            {"role": "assistant", "content": '{"topic": "product-complaint", "requires_resources": 1}'},

            {"role": "user", "content": "My laptop has been overheating, can you help me troubleshoot this issue?"},
            {"role": "assistant", "content":'{"topic": "product-complaint", "requires_resources": 1}'},

            {"role": "user", "content": "I placed an order last week and I haven't received a confirmation email, could you check my order status?"},
            {"role": "assistant", "content": '{"topic": "order-inquiry", "requires_resources": 1}'},

            {"role": "user", "content": "It's been quite rainy this season, hasn't it?"},
            {"role": "assistant", "content": '{"topic": "general-talking", "requires_resources": 1}'},

            {"role": "user", "content": `${custom_message}`},
        ]

        return messages;
    }

    static async summarizationTemplate(messages_elements, max_summary_length = 100) {
        let messages = [
            {
                "role": "system", 
                "content": "You are an NLU Engine for summarizing a conversation between a Customer Support Agent (CSA) and a Customer (C).",
            },
        ]

        // iterate over all messages dom element and push the conversation to the messages array
        let conversation = ["\n### Conversation:\n"]
        conversation = conversation.concat(await this.collectConversationMessages(messages_elements))

        // task description
        conversation.push([
            "\n### Summarization Request Task:",
            `\nPlease provide a brief summary of the above conversation.`,
            "Ensure that the summary is concise and accurately reflects the key points of the dialogue without introducing any information that was not mentioned by the participants.",
            "If the question is not answerable, please mentioned `the customer did not get a response yet` in uppercase letters. do not try to generate non existed response.",
            `The summry should not exceed ${max_summary_length} words.`,
            "Your summary must be short and concise, and it should not contain any unnecessary information.",
            "The summary should contain at the end a section called (Unresponded Messages) that contains all messages that the customer did not get a response yet.",
            "Do not start with any introductory phrases such as 'The following is a conversation between...' or 'Sure, I'd be happy to help you with that ..'.`",
            "Do not include the conversation in the summary.",
            "Do not make a summary in a conversation style. Just summerize what happened in short sentences.",
            "\n",
            "### Summary:",
            "\n"
        ].join("\n"))


        messages.push({"role": "user", "content": conversation.join('\n')});
        return messages;
    }

    static async aiComposerAugmentedTemplate(user_message, book_documents) {
        
        let documents = ["\n### Documents:\n"]
        for(var x in book_documents){
            documents.push(`\n### Document ${parseInt(x) + 1}:`)
            documents.push(`${book_documents[x].text}`)
        }

        documents= documents.concat([
            "\n### customer message:",
            `${user_message}`,
            "\n### Task Describtion:",
            "Please provide an answer to the customer's message. Only provide one answer.",
            "You must has good confident about the answer, or you can just say `Sorry, I don't know`.",
            "\n### Answer:",
            "\n\n"
        ])

        return [
            {
                "role": "system",
                "content": [
                    "You are a customer service agent who is trying to respond to a customer message.",
                    "Next, you have multiple documents that you can use to generate the response.",
                    "You have to generate only one appropriate response from the given documents.",
                ].join("\n"),
            },
            {
                "role": "user",
                "content": documents.join('\n')
            }
        ]
    }

    static async aiComposerPlainTemplate(messages_elements, max_window_length = 6) {

        let messages = [
            {
                "role": "system",
                "content": [
                    "You are a customer service agent who is trying to respond to a customer message.",
                    "You will read the follwing conversation between a Customer Support Agent (CSA) and a Customer (C).",
                    "You have to generate only one appropriate response.",
                ].join("\n"),
            }
        ]

        // iterate over all messages dom element and push the conversation to the messages array
        let conversation = ["\n### Conversation:\n"]
        conversation = conversation.concat(await this.collectConversationMessages(messages_elements, max_window_length))

        // task description
        conversation.push([
            "\n### Task Describtion:",
            `\nPlease provide an answer to the last customer's message. Only provide one answer.`,
            'If the question is political or inappropriate, please generate an execuse message for the user and mention that you cannot answer this question.',
            'If the message is a greeting, please respond with a short greeting.',
            'If the personal information is requested, please respond with a generic answer which does not mention any name, race, gender or age.',
            'provide a short answer that is not longer than 100 words.',
            'Just generate the answer for the user. Do not start with introduction phrases such as `Sure, I can generate ..` or `Here\'s my response to ..` or `Please find the response ..`.',
            "\n",
            "### Response:",
            "\n"
        ].join("\n"))

        messages.push({"role": "user", "content": conversation.join('\n')});
        return messages;
    }

    static async collectConversationMessages(messages_elements, max_window_length=null){
        // iterate over all messages dom element and push the conversation to the messages array
        let conversation = [];
        for(var x in messages_elements){
            // check if class = 'left' is in the dom element
            if(messages_elements[x].classList && messages_elements[x].classList.contains('left')){
                // query the div.text-content of the message
                let message_text = messages_elements[x].querySelector('div.text-content p');

                // extract a topic for the message
                let dom_text = message_text.innerText;

                // split by \n and remove the last line
                dom_text = dom_text.split('\n');
                dom_text.pop();
                dom_text = dom_text.join('\n');

                conversation.push(`- (C): ${dom_text}`);
            } else if (messages_elements[x].classList && messages_elements[x].classList.contains('right')) {
                // query the div.text-content of the message
                let message_text = messages_elements[x].querySelector('div.text-content p');

                // extract a topic for the message
                let dom_text = message_text.innerText;
                conversation.push(`- (CSA): ${dom_text}`);
            }
        }

        if(max_window_length){
            // return last max_window_length messages
            return conversation.slice(-max_window_length);
        }

        return conversation;
    }
}