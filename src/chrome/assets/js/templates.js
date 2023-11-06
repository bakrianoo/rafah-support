class Templates {
    static topicModelingTemplate(custom_message= "") {

        let messages = [

            {"role": "system", "content": "You are an NLU Engine for detecting the topic name. You can type `none` for unspecific message."},

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
}