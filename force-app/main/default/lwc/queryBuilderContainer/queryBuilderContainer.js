import { LightningElement } from 'lwc';

import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import ACCOUNT_OBJECT from '@salesforce/schema/Account';
import CASE_OBJECT from '@salesforce/schema/Case';
import CONTACT_OBJECT from '@salesforce/schema/Contact';
import LEAD_OBJECT from '@salesforce/schema/Lead';
import OPPORTUNITY_OBJECT from '@salesforce/schema/Opportunity';

import getQueryableFields from '@salesforce/apex/QueryBuilderService.getQueryableFields';
import getQueryResults from '@salesforce/apex/QueryBuilderService.getQueryResults';

const OBJECT_OPTIONS =  [
    {
        label: ACCOUNT_OBJECT.objectApiName, 
        value: ACCOUNT_OBJECT.objectApiName
    },
    {
        label: CASE_OBJECT.objectApiName, 
        value: CASE_OBJECT.objectApiName
    },
    {
        label: CONTACT_OBJECT.objectApiName,
        value:  CONTACT_OBJECT.objectApiName
    },
    {
        label: LEAD_OBJECT.objectApiName,
        value:  LEAD_OBJECT.objectApiName
    },
    {
        label: OPPORTUNITY_OBJECT.objectApiName,
        value: OPPORTUNITY_OBJECT.objectApiName
    }
];

// pretty up available fields
// only display accessible objects
// pretty table display for query results

export default class QueryBuilderContainer extends LightningElement {
    displayQueryBuilder;
    fieldOptions;
    objectName;
    objectOptions;
    queryFields = [];

    connectedCallback() {
        this.objectOptions = OBJECT_OPTIONS;
    }

    async handleObjectChange(event) {
        this.objectName = event.detail.value;

        try {
            let queryableFields = await getQueryableFields({objectName: this.objectName});
    
            this.fieldOptions = [];
    
            for(let field of queryableFields) {
                this.fieldOptions.push({
                    label: field,
                    value: field
                });
            }
    
            this.displayQueryBuilder = true;
        } catch(err) {
            console.log(err);
        }
    }

    handleListboxChange(event) {
        this.queryFields = event.detail.value;
    }

    async handleExecuteQuery() {
        if(this.queryFields.length > 0) {
            let queryString = 'SELECT ' + this.queryFields.join(', ') + ' FROM ' + this.objectName;

            try {
                let queryResults = await getQueryResults({queryString: queryString});
    
                console.log(queryResults);
            } catch(err) {
                console.error(err);
            }
        } else {
            const toastEvent = new ShowToastEvent({
                title: 'Error',
                message: 'You must select at least one field for your query.',
                variant: 'error'
            });

            this.dispatchEvent(toastEvent);
        }
    }
}