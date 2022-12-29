import 'https://cdnjs.cloudflare.com/ajax/libs/ajv/8.11.2/ajv7.min.js';

import { App } from './app.js';
import { schema } from './schema.js';

const response = await fetch('assets/json/data.json');
const data = await response.json();

if (checkData(data, schema)) {
    new App(data).initialize();
}

function checkData(data, schema) {
    const validate = new ajv7().compile(schema);

    if (validate(data)) {
        return true;
    }

    console.log('The data is invalid:');
    console.log(validate.errors);

    return false;
}




