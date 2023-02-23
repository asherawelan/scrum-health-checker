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
            this.saveToLocalStorage();
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
        let data = JSON.parse(localStorage.getItem('data'));

        return this.check(data, schema) ? data : null;
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
     * Downloads JSON from local storage
     */
    download() {
        const data = this.loadFromLocalStorage();

        let blob = new Blob([JSON.stringify(data, null, 2)], {
            type: 'application/json; charset=utf-8'
        });

        saveAs(blob, `${this.team()} - ${this.formattedDate(this.data.completedDate())}.json`);
    }

    /**
     * Present a browse box to choose the JSON file
     */
    upload() {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';

        fileInput.addEventListener('change', (event) => {
            const file = event.target.files[0];

            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const data = JSON.parse(event.target.result);
                    this.data = this.check(data, schema) ? data : null;
                    this.saveToLocalStorage( () => {
                        this.reload();
                    });

                } catch (error) {
                    alert('An error occurred - check the console');
                    console.log(error);
                }
            };
            reader.readAsText(file);
        });

        fileInput.click();
    }

    /**
     * Returns just the sections from the json data
     * @returns {}
     */
    sections() {
        return this.data.sections;
    }

    /**
     * Returns a formatted date
     * @returns {string}
     */
    formattedDate(value) {
        return new Date(value).toLocaleDateString(
            'en-GB', { day: 'numeric', month: 'short', year: 'numeric' }
        );
    }

    /**
     * Reloads the app
     * @returns {string}
     */
    reload() {
        location.reload();
    }

    /**
     * Returns the team
     * name
     * @returns {string}
     */
    team() {
        return this.data.team
    }

    /**
     * Returns the completed date
     * name
     * @returns {string}
     */
    completedDate() {
        return this.data.completedDate
    }

    /**
     * Updates the checked value in the data using
     * section and question indexes as indices
     * then fire an event to update the charts
     * @param section
     * @param question
     * @param checked
     */
    updateSection(section, question, checked) {
        this.data
            .sections[section]
            .questions[question]
            .checked = checked;

        this.saveToLocalStorage( () => {
            this.dispatchDoChartUpdateEvent();
        });
    }

    /**
     * Update the completed date, then update the charts
     */
    updateCompletedDate(value, callback) {
        this.data.completedDate = value;
        this.saveToLocalStorage( () => {
            if(callback){
                callback(value);
            }
            this.dispatchDoChartUpdateEvent()
        });
    }

    /**
     * Update the team data, then update the charts
     */
    updateTeam(value) {
        this.data.team = value;
        this.saveToLocalStorage( () => {
            this.dispatchDoChartUpdateEvent()
        });
    }

    /**
     * Save to local storage, ready for use again in the future
     */
    saveToLocalStorage(callback) {
       localStorage.setItem('data', JSON.stringify(this.data));
       if(callback){
           callback();
       }
    }

    /**
     * Dispatches an event that charts will
     * pick up and action
     */
    dispatchDoChartUpdateEvent() {
        window.dispatchEvent(
            new Event('doChartUpdates')
        );
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
