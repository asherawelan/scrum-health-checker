import {schema} from './schema.js';

export class Data {
    /**
     * Loads the data from local storage, if this isn't
     * present, then the data is loaded from json file.
     * @param callback
     * @returns {Promise<void>}
     */
    async load(callback) {
        const data = localStorage.getItem('data');

        if (data) {
            this.data = JSON.parse(data);
        } else {
            const response = await fetch('./assets/json/data.json');
            if (response.ok) {
                const data = await response.json();
                this.data = this.check(data, schema) ? data : null;
            }
        }
        callback(this);
    }

    /**
     * Returns just the sections from the json data
     * @returns {}
     */
    getSections() {
        return this.data.sections;
    }

    /**
     * Updates the checked value in the data using
     * section and question indexes as indices
     * @param section
     * @param question
     * @param checked
     */
    update(section, question, checked) {
        this.data
            .sections[section]
            .questions[question]
            .checked = checked;

        localStorage.setItem('data', JSON.stringify(this.data));

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
        const ajv = new window.ajv7();
        const validate = ajv.compile(schema);

        let valid = validate(data);

        if (valid !== true) {
            throw new Error(ajv.errorsText(validate.errors));
        }
        return valid;
    }
}
