import 'https://code.jquery.com/jquery-3.6.0.min.js';
import 'https://cdn.jsdelivr.net/npm/chart.js';

export class App {

    constructor(data) {
        this.data = data;
    }

    /**
     * Renders the accordion and chart
     */
    initialize() {
        this.renderAccordion();
        this.renderChart();
    }

    /**
     * Updates the checked value in the data using
     * section and question indexes as indices
     * @param section
     * @param question
     * @param checked
     */
    updateData(section, question, checked) {
        this.data
            .sections[section]
            .questions[question]
            .checked = checked;
    }

    /**
     * Populates the accordion, collapses the first
     * accordion item and then remove any template
     * artifacts from the dom
     */
    renderAccordion() {
        let accordion = this.populateAccordion(
            $('.accordion'), this.data.sections
        );

        accordion.find('.accordion-collapse')
            .not('.template')
            .collapse();

        accordion.find('.template').remove();
    }

    /**
     * Returns a populated accordion, By iterating over each
     * section and creating and appending  new accordion items.
     * @param accordion
     * @param sections
     * @returns {*}
     */
    populateAccordion(accordion, sections) {
        const boundCreateAccordionItem = this.createAccordionItem.bind(this);
        const boundPopulateAccordionItem = this.populateAccordionItem.bind(this);

        $(sections).each(function (i) {
            let accordionItem = boundCreateAccordionItem(
                i, this.title,
                accordion.find('.accordion-item.template')
            );

            accordion.append(
                boundPopulateAccordionItem(
                    accordionItem, this.questions
                )
            );
        });

        return accordion;
    }

    /**
     * Returns a accordion item populated with questions
     * @param accordionItem
     * @param questions
     * @returns {*}
     */
    populateAccordionItem(accordionItem, questions) {
        const boundCreateListItemCheckBox = this.createListItemCheckBox.bind(this);

        $(questions).each(function (i) {
            let listItem = boundCreateListItemCheckBox(
                i, this.text, this.checked,
                accordionItem.find('li.template')
            );

            accordionItem.find('ul').append(listItem);
        });

        return accordionItem;
    }

    /**
     * Returns a new accordion item from a template
     * @param id
     * @param title
     * @param template
     * @returns {*}
     */
    createAccordionItem(id, title, template) {
        let el = this.cloneFromTemplateElement(template);

        el.attr('data-id', id);
        el.find('.accordion-header').attr('id', `accordion-item-${id}`);
        el.find('.accordion-collapse').attr({
            'id': `accordion-item-${id}-collapse`,
            'data-bs-parent': '#sections'
        });
        el.find('.accordion-button').attr({
            'data-bs-toggle': 'collapse',
            'aria-expanded': 'false',
            'data-bs-target': `#accordion-item-${id}-collapse`
        }).text(title);

        return el;
    }

    /**
     * Returns a new list item from a template. It has a
     * check box in it, when clicked, this will cause
     * the chart to update.
     * @param id
     * @param label
     * @param checked
     * @param template
     * @returns {*}
     */
    createListItemCheckBox(id, label, checked, template) {
        const boundUpdateData = this.updateData.bind(this);
        const boundUpdateChart = this.updateChart.bind(this);

        let el = this.cloneFromTemplateElement(template);

        el.attr('data-id', id);
        el.find('input').prop('checked', checked);
        el.find('label').text(label);

        el.find('input').on('change', function () {
            boundUpdateData(
                $(this).closest('.section').attr('data-id'),
                $(this).closest('.question').attr('data-id'),
                $(this).is(':checked')
            );

            boundUpdateChart();
        });

        return el;
    }

    /**
     * Returns an array of labels from the data that can be used
     * by the chart
     * @returns {*[]}
     */
    createChartLabels() {
        let labels = Object.values(this.data.sections).map(function (value) {
            return value.title;
        });

        return labels;
    }

    /**
     * Returns an array of values from the list item check box states
     * by section, that can be plotted on the chart
     * @returns {*[]}
     */
    createChartData() {
        let data = Object.values(this.data.sections).map(function (value) {
            let values = Object.values(value.questions).map(function (question) {
                return question['checked'];
            });

            return values.filter(function (value) {
                return value == true;
            }).length;
        });

        return data;
    }

    /**
     * Updates the chart
     */
    updateChart() {
        this.chart.data.datasets[0].data = this.createChartData();
        this.chart.update();
    }

    /**
     * Renders the chart
     */
    renderChart() {
        let chart = $('#spiderChart')

        this.chart = new Chart(chart, {
            type: 'radar',
            data: {
                labels: this.createChartLabels(),
                datasets: [
                    {
                        label: 'Actual',
                        fill: true,
                        backgroundColor: 'rgba(179,181,198,0.2)',
                        borderColor: 'rgba(179,181,198,1)',
                        pointBorderColor: '#fff',
                        pointBackgroundColor: 'rgba(179,181,198,1)',
                        data: this.createChartData()
                    }, {
                        label: 'Ideal',
                        fill: true,
                        backgroundColor: 'rgba(255,99,132,0.2)',
                        borderColor: 'rgba(255,99,132,1)',
                        pointBorderColor: '#fff',
                        pointBackgroundColor: 'rgba(255,99,132,1)',
                        data: [7, 7, 7, 7, 7, 7, 7, 7, 7]
                    }
                ]
            },
            options: {
                title: {
                    display: true,
                    text: 'Test Title'
                },
                scale: {
                    min: 0,
                    max: 10,
                    ticks: {
                        beginAtZero: true,
                        fontSize: 20,
                        gridLines: {
                            color: 'rgba(0, 0, 0, 0.2)'
                        },
                        angleLines: {
                            color: '#000'
                        }
                    }
                },
                scales: {
                    r: {
                        pointLabels: {
                            font: {
                                size: 18
                            }
                        }
                    }
                }
            }
        });
    }

    /**
     * Returns a clone of the given element. Removes any classes
     * that define it as a template artifact
     * @param templateElement
     * @returns {*}
     */
    cloneFromTemplateElement(templateElement) {
        return templateElement.clone().removeClass('template d-none');
    }
}
