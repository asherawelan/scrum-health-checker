export class Accordion {

    constructor(data) {
        this.data = data;
    }

    /**
     * Populates the accordion, collapses the first
     * accordion item and then remove any template
     * artifacts from the dom
     */
    render() {
        let accordion = this.populate(
            $('.accordion'), this.data.sections()
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
    populate(accordion, sections) {
        $(sections).each( (i, section) => {
            let accordionItem = this.createItem(
                i, section.title,
                accordion.find('.accordion-item.template')
            );

            accordion.append(
                this.populateItem(
                    accordionItem, section.questions
                )
            );
        });

        return accordion;
    }

    /**
     * Returns an accordion item populated with questions
     * @param item
     * @param questions
     * @returns {*}
     */
    populateItem(item, questions) {
        $(questions).each( (i, question) => {
            let listItem = this.createListItemCheckBox(
                i, question.text, question.checked,
                item.find('li.template')
            );

            item.find('ul').append(listItem);
        });

        return item;
    }

    /**
     * Returns a new accordion item from a template
     * @param id
     * @param title
     * @param template
     * @returns {*}
     */
    createItem(id, title, template) {
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
        let el = this.cloneFromTemplateElement(template);

        el.attr('data-id', id);
        el.find('input').prop('checked', checked);
        el.find('label').text(label);

        el.find('input').on('change', (e) => {
            let el = e.target;
            this.data.updateSection(
                $(el).closest('.section').attr('data-id'),
                $(el).closest('.question').attr('data-id'),
                $(el).is(':checked')
            );
        });

        return el;
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