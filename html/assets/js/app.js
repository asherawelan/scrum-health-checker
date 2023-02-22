import {Data} from "./data.js";
import {Accordion} from "./accordion.js";
import {Radar} from "./radar.js";
import {Pdf} from "./pdf.js";

export class App {
    /**
     * Sets up the app components
     */
    initialize() {
        try {
            new Data().load( (data) => {

                this.accordion = new Accordion(data);
                this.radar = new Radar(data);

                this.accordion.init(
                    (data) => {
                        $('#team').on('change', (e) => {
                            data.updateTeam(e.currentTarget.value);
                        }).val(data.team());

                        $('#reset').on('click', (e) => {
                            data.reset();
                        });

                        $('#download-json').on('click', (e) => {
                            data.download();
                        });

                        $('#upload-json').on('click', (e) => {
                            data.upload();
                        });
                    }
                );

                this.radar.init(
                    (radar) => {
                        $('#download-graph').on('click', (e) => {
                            radar.download();
                        });
                    }
                );

                // new Pdf(data).init(
                //     (pdf) => {
                //         console.log(123);
                //     }
                // );
            });
        } catch (error) {
            console.log(error);
        }
    }
}