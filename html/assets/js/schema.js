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
                                score: {type: 'boolean'}
                            },
                            required: ['text', 'checked']
                        },
                        minItems: 1,
                        uniqueItems: true
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