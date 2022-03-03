declare module "@salesforce/apex/QueryBuilderService.getQueryableFields" {
  export default function getQueryableFields(param: {objectName: any}): Promise<any>;
}
declare module "@salesforce/apex/QueryBuilderService.getQueryResults" {
  export default function getQueryResults(param: {queryString: any, whereClause: any}): Promise<any>;
}
