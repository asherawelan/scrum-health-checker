export class App {

    constructor(accordion, radar) {
        this.accordion = accordion;
        this.radar = radar;
    }

    /**
     * Renders the accordion and chart
     */
    initialize() {
        this.accordion.render();
        this.radar.render();
    }
}
