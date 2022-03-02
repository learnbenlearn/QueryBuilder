import { LightningElement, api } from 'lwc';

export default class QueryResultsTable extends LightningElement {
    @api tableData;
    @api tableColumns;
}