import {Data} from "./data.js";
import {Accordion} from "./accordion.js";
import {Radar} from "./radar.js";

export class App {
    /**
     * Renders the accordion and chart
     */
    initialize() {
        try {
            new Data().load(function (data) {
                new Accordion(data).render();
                new Radar(data).render();
            });
        } catch (error) {
            console.log(error);
        }
    }
}