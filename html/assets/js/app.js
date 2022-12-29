let data = {};

$(function () {
    $.getJSON('assets/json/data.json', function (data) {

        if (checkData(data)) {
            const hc = new AgileScrumHealthCheck(data);
            hc.initialize();
        }
    });
});

class AgileScrumHealthCheck {

    constructor(data) {
        this.data = data;
    }

    initialize() {
        this.renderAccordion();
        this.renderChart();
    }

    renderAccordion() {
        let accordion = this.populateAccordion(
            $('.accordion'), this.data.sections
        );

        accordion.find(':checkbox').on('change', function () {
            let sectionIndex = this.closest('.section');
            console.log(sectionIndex);

            //this.createJsonFromAccordion(accordion);
        });

        accordion.find('.accordion-collapse')
            .not('.template')
            .collapse();

        accordion.find('.template').remove();
    }

    populateAccordion(accordion, sections) {
        const boundCreateAccordionItem = this.createAccordionItem.bind(this);
        const boundPopulateAccordionItem = this.populateAccordionItem.bind(this);

        $(sections).each(function (index) {
            let accordionItem = boundCreateAccordionItem(
                index, this.title,
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

        $(questions).each(function (index) {
            let listItem = boundCreateListItemCheckBox(
                this.text, this.checked,
                accordionItem.find('li.template')
            );

            listItem.find(':checkbox').attr('data-index', index);

            accordionItem.find('ul').append(listItem);
        });

        return accordionItem;
    }

    createAccordionItem(id, title, template) {
        let el = this.cloneFromTemplateElement(template);

        el.attr('data-index', id);

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

    createListItemCheckBox(label, checked, template) {
        let el = this.cloneFromTemplateElement(template);

        el.find('input').prop('checked', checked);
        el.find('label').text(label);

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

    renderChart() {

        new Chart(document.getElementById("myChart"), {
            type: 'radar',
            data: {
                labels: this.createChartLabels(),
                datasets: [
                    {
                        label: "Actual",
                        fill: true,
                        backgroundColor: "rgba(179,181,198,0.2)",
                        borderColor: "rgba(179,181,198,1)",
                        pointBorderColor: "#fff",
                        pointBackgroundColor: "rgba(179,181,198,1)",
                        data: this.createChartData()
                    }, {
                        label: "Ideal",
                        fill: true,
                        backgroundColor: "rgba(255,99,132,0.2)",
                        borderColor: "rgba(255,99,132,1)",
                        pointBorderColor: "#fff",
                        pointBackgroundColor: "rgba(255,99,132,1)",
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
                            color: 'black'
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


function checkData(data) {
    const Ajv = window.ajv7
    const ajv = new Ajv()

    const schema = {
        type: 'object',
        properties: {
            sections: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        title: {type: 'string'},
                        questions: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    text: {type: 'string'},
                                    score: {type: 'boolean'}
                                },
                                required: ['text', 'checked']
                            },
                            minItems: 1,
                            uniqueItems: true
                        }
                    },
                    required: ['title', 'questions']
                },
                minItems: 1,
            },
        },
        required: ['sections'],
        additionalProperties: false
    }

    const validate = ajv.compile(schema);
    const valid = validate(data);

    if (!valid) {
        console.log('The data is invalid:');
        console.log(validate.errors);
    }

    return valid;
}


