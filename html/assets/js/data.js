import {schema} from './schema.js';

export class Data {
    /**
     * Loads the data from local storage, if this isn't
     * present, then the data is loaded from json file.
     * @param callback
     * @returns {Promise<void>}
     */
    async load(callback) {
        // Try and load the data from local storage, if
        // that doesn't exist, load from the file.
        try {
            this.data = this.loadFromLocalStorage();
        } catch (error) {
            this.data = await this.loadJsonFromFile();
        }

        callback(this);
    }

    /**
     * Loads JSON from file - used when no JSON exists
     * in the local storage
     * @returns {Promise<any|null>}
     */
    async loadJsonFromFile() {
        const response = await fetch('./assets/json/data.json');
        const data = await response.json();

        return this.check(data, schema) ? data : null;
    }

    /**
     * Loads JSON from the local storage, and parses it ready
     * to be used by the accordion and chart
     * @returns {any}
     */
    loadFromLocalStorage() {
        const data = localStorage.getItem('data');

        if (!data) {
           throw new Error('Nothing saved in local storage');
        }

        return JSON.parse(data);
    }

    /**
     * Clears any data saved in local storage and refreshes
     * the page, ready to start over
     */
    reset() {
        localStorage.removeItem('data');
        location.reload();
    }

    /**
     * Returns just the sections from the json data
     * @returns {}
     */
    sections() {
        return this.data.sections;
    }

    team() {
        return this.data.team
    }

    /**
     * Updates the checked value in the data using
     * section and question indexes as indices
     * @param section
     * @param question
     * @param checked
     */
    updateSection(section, question, checked) {
        this.data
            .sections[section]
            .questions[question]
            .checked = checked;

        this.save();
    }

    updateTeam(title) {
        this.data.team = title;

        this.save();
    }

    save() {
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
