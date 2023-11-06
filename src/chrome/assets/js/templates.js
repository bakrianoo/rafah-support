class Templates {
    static topicModelingTemplate(custom_message= "") {
        let template = [
            'You have to classify messages into topics. The topics are:',
            'greetings,product-inquery,product-complaint,product-support,order-inquery,order-complaint,shipping-complaint,shipping-inquery,policy-inquery,general-talking',
            'if you can not specify the topic, set it to none.',
            'follow the following examples:',
            '- Hello, how can I assist you today?:greetings',
            '- Can you provide more details about the material of the yoga mats listed on your website?:product-inquiry',
            '- I\'ve received a damaged speaker, and I would like to know what can be done about this.:product-complaint',
            '- My laptop has been overheating, can you help me troubleshoot this issue?:product-support',
            '- I placed an order last week and I haven\'t received a confirmation email, could you check my order status?:order-inquiry',
            '- I\'ve reported an issue with my recent order of books, but there\'s been no response yet.:order-complaint',
            '- My package was supposed to arrive last Tuesday, but it hasn\'t been delivered yet, what\'s going on?:shipping-complaint',
            '- Could you tell me when my package is expected to arrive if I order it with expedited shipping?:shipping-inquiry',
            '- Where can I find your return policy information for electronics?:policy-inquiry',
            '- It\'s been quite rainy this season, hasn\'t it?:general-talking',
            `${custom_message} `
        ];

        // combine the array into a string with new line
        return template.join('\n');
    }
}