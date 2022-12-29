import 'https://code.jquery.com/jquery-3.6.0.min.js';
import 'https://cdn.jsdelivr.net/npm/chart.js';

export class App {

    constructor(data) {
        this.data = data;
    }

    initialize() {
        this.renderAccordion();
        this.renderChart();
    }

    updateData(section, question, checked) {
        this.data
            .sections[section]
            .questions[question]
            .checked = checked;
    }

    renderAccordion() {
        let accordion = this.populateAccordion(
            $('.accordion'), this.data.sections
        );

        accordion.find('.accordion-collapse')
            .not('.template')
            .collapse();

        accordion.find('.template').remove();
    }

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

    createChartLabels() {
        let labels = Object.values(this.data.sections).map(function (value) {
            return value.title;
        });

        return labels;
    }

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

    updateChart() {
        this.chart.data.datasets[0].data = this.createChartData();
        this.chart.update();
    }

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

    cloneFromTemplateElement(templateElement) {
        return templateElement.clone().removeClass('template d-none');
    }
}
