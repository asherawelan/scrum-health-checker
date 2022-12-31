import { App } from './app.js';
import { schema } from './schema.js';

$(function() {
    $.getJSON('assets/json/data.json', function(data) {
        if (checkData(data, schema)) {
            new App(data).initialize();
        }
    });
});

/**
 * Checks the json data loaded matches the schema
 * required for the app to work as expected
 * @param data
 * @param schema
 * @returns {boolean}
 */
function checkData(data, schema) {
    const Ajv = window.ajv7

    const validate = new Ajv().compile(schema);

    if (validate(data)) {
        return true;
    }

    console.log('The data is invalid:');
    console.log(validate.errors);

    return false;
}




