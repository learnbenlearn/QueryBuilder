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

// only display accessible objects
// include functionality for creating a secure where clause

export default class QueryBuilderContainer extends LightningElement {
    displayQueryBuilder;
    displayTable;
    fieldOptions;
    fieldsToQuery = [];
    objectName;
    objectOptions;
    queryableFields;
    tableData;
    tableColumns;

    connectedCallback() {
        this.objectOptions = OBJECT_OPTIONS;
    }

    async handleObjectChange(event) {
        this.objectName = event.detail.value;

        try {
            this.queryableFields = await getQueryableFields({objectName: this.objectName});
            
            this.fieldOptions = [];
    
            for(let field in this.queryableFields) {
                this.fieldOptions.push({
                    label: this.queryableFields[field],
                    value: field
                });
            }
    
            this.displayQueryBuilder = true;
        } catch(err) {
            console.log(err);
        }
    }

    handleListboxChange(event) {
        this.fieldsToQuery = event.detail;
    }

    async handleExecuteQuery(event) {
        let whereClause = event.detail;

        if(this.fieldsToQuery.length > 0) {
            let queryString = 'SELECT ' + this.fieldsToQuery.join(', ') + ' FROM ' + this.objectName;

            this.populateTableColumns();

            try {
                let queryResults = await getQueryResults({queryString: queryString, whereClause: whereClause});

                this.tableData = queryResults;
                this.displayTable = true;

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

    populateTableColumns() {
        this.tableColumns = [];

        for(let field of this.fieldsToQuery) {
            this.tableColumns.push({
                label: this.queryableFields[field],
                fieldName: field
            });
        }
    }
}