import {Data} from "./data.js";
import {Accordion} from "./accordion.js";
import {Radar} from "./radar.js";

export class App {
    /**
     * Renders the accordion and chart
     */
    initialize() {
        try {
            new Data().load( (data) => {
                new Accordion(data).render(
                    (data) => {
                        $('#team').on('change', function () {
                            data.updateTeam(this.value);
                        }).val(data.team());

                        $('#reset').on('click',  (e) => {
                            data.reset();
                        });
                    }
                );

                new Radar(data).render(
                    (radar) => {
                        $('#download').on('click',  (e) => {
                            radar.download();
                        });
                    }
                );

            });
        } catch (error) {
            console.log(error);
        }
    }
}