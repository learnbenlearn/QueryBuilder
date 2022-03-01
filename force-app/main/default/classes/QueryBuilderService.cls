/**
 * @description       : 
 * @author            : Ben Learn
 * @group             : 
 * @last modified on  : 03-01-2022
 * @last modified by  : Ben Learn
**/
public with sharing class QueryBuilderService {
    @AuraEnabled(cacheable=true)
    public static List<String> getQueryableFields(String objectName) {
        Schema.DescribeSObjectResult objectResult = Schema.describeSObjects(new List<String>{objectName})[0];

        Map<String, Schema.SObjectField> objectFields = objectResult.fields.getMap();

        List<String> queryableFields = new List<String>();

        for(Schema.SObjectField field : objectFields.values()) {
            if(field.getDescribe().isAccessible()) {
                queryableFields.add(field.getDescribe().getName());
            }
        }

        return queryableFields;
    }

    @AuraEnabled(cacheable=true)
    public static List<sObject> getQueryResults(String queryString) {
        return Database.query(queryString);
    }
}
