$(function () {
    $.getJSON('assets/json/data.json', function (data) {
        if (!checkData(data)) {
            return;
        }

        let accordion = populateAccordion(
            $('.accordion'), data.sections
        );

        accordion.find('.accordion-collapse:first').collapse();
        accordion.find('.template').remove();
    });
});

function populateAccordion(accordion, sections){
    $(sections).each(function (id) {
        let accordionItem = createAccordionItem(
            id, this.title,
            accordion.find('.accordion-item.template')
        );

        accordion.prepend(
            populateAccordionItem(
                accordionItem, this.questions
            )
        );
    });

    return accordion;
}

function populateAccordionItem(accordionItem, questions){
    $(questions).each(function (index) {
        let listItem = createListItem(
            accordionItem.attr('data-section-id'),
            index, this, accordionItem.find('ul li.template')
        );

        accordionItem.find('ul').append(listItem);
    });

    return accordionItem;
}

function createAccordionItem(id, title, template) {
    let el = cloneFromTemplateElement(template);

    el.attr('data-section-id', id);

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

function createListItem(sectionId, id, label, template){
    let el = cloneFromTemplateElement(template);

    el.find('input').attr('id', `list-item-${sectionId}-${id}`);
    el.find('label').attr('for', `list-item-${sectionId}-${id}`).text(label);

    return el;
}

function cloneFromTemplateElement(templateElement){
    return templateElement.clone().removeClass('template d-none');
}



new Chart(document.getElementById("myChart"), {
    type: 'radar',
    data: {
        labels: [
            'Sprint Planning',
            'Daily Scrum / Standup',
            'Sprint Review',
            'Sprint Retrospective',
            'Product Owner',
            'Scrum Master',
            'Dev Team Skills',
            'Product Backlog: Refinement',
            'Sprint Backlog'
        ],
        datasets: [
            {
                label: "Actual",
                fill: true,
                backgroundColor: "rgba(179,181,198,0.2)",
                borderColor: "rgba(179,181,198,1)",
                pointBorderColor: "#fff",
                pointBackgroundColor: "rgba(179,181,198,1)",
                data: [2, 3, 4, 7, 8, 4, 3, 3, 5]
            }, {
                label: "Ideal",
                fill: true,
                backgroundColor: "rgba(255,99,132,0.2)",
                borderColor: "rgba(255,99,132,1)",
                pointBorderColor: "#fff",
                pointBackgroundColor: "rgba(255,99,132,1)",
                pointBorderColor: "#fff",
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
                            items: {type: 'string'},
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
