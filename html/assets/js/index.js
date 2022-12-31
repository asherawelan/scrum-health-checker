import { Data } from './data.js';
import { Accordion } from './accordion.js';
import { Radar } from "./radar.js";
import { App } from './app.js';

$(function() {
    $.getJSON('assets/json/data.json', function(data) {

        try {
            data = new Data(data);

            new App(
                new Accordion(data),
                new Radar(data)
            ).initialize();
        } catch (error) {
            console.log(error);
        }
    });
});






