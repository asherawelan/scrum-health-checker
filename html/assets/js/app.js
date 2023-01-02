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
                new Accordion(data).render();
                new Radar(data).render();

                this.setup(data);
            });
        } catch (error) {
            console.log(error);
        }
    }

    setup(data) {
        // When the team name is changed then data and chart updated
        $('#team').on('change', function () {
            data.updateTeam(this.value);
        }).val(data.team());
    }
}