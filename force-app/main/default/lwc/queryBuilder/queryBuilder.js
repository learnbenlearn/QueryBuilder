import { LightningElement, api } from 'lwc';

export default class QueryBuilder extends LightningElement {
    @api buttonLabel;
    displayInputText;
    @api listboxOptions;

    handleListboxChange(event) {
        const listboxChange = new CustomEvent('listboxchange', {
            detail: event.detail.value
        })

        this.dispatchEvent(listboxChange);
    }

    handleClick() {
        const listboxClick = new CustomEvent('listboxclick', {
            detail: this.template.querySelector('lightning-input.whereClauseInput').value
        });

        this.dispatchEvent(listboxClick);
    }

    handleToggleChange() {
        this.displayInputText = !this.displayInputText;
    }
}