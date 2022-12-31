import { schema } from './schema.js';

export class Data {

    constructor(data) {
        this.check(data, schema);

        this.data = data;
    }

    getSections(){
        return this.data.sections;
    }

    /**
     * Updates the checked value in the data using
     * section and question indexes as indices
     * @param section
     * @param question
     * @param checked
     */
    update(section, question, checked){
        this.data
            .sections[section]
            .questions[question]
            .checked = checked;

        $(this).trigger('change');
    }

    /**
     * Checks the json data loaded matches the schema
     * required for the app to work as expected
     * @param data
     * @param schema
     * @returns {boolean}
     */
    check(data, schema) {
        const ajv = new  window.ajv7();
        const validate = ajv.compile(schema);

        let valid;

        if (valid = validate(data) !== true) {
            throw new Error(ajv.errorsText(validate.errors));
        }

        return valid;
    }
}
