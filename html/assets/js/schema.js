export const schema = {
    type: 'object',
    properties: {
        sections: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    title: {type: 'string'},
                    questions: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                text: {type: 'string'},
                                checked: {type: 'boolean'}
                            },
                            required: ['text']
                        },
                        minItems: 1
                    }
                },
                required: ['title', 'questions']
            },
            minItems: 1,
        },
    },
    required: ['sections'],
    additionalProperties: false
}