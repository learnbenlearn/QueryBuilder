/**
 * @description       : 
 * @author            : Ben Learn
 * @group             : 
 * @last modified on  : 03-03-2022
 * @last modified by  : Ben Learn
**/
public with sharing class QueryBuilderService {
    @AuraEnabled(cacheable=true)
    public static Map<String, String> getQueryableFields(String objectName) {
        Schema.DescribeSObjectResult objectResult = Schema.describeSObjects(new List<String>{objectName})[0];

        Map<String, Schema.SObjectField> objectFields = objectResult.fields.getMap();

        Map<String, String> queryableFieldMap = new Map<String, String>();

        for(Schema.SObjectField field : objectFields.values()) {
            if(field.getDescribe().isAccessible()) {
                queryableFieldMap.put(field.getDescribe().getName(), field.getDescribe().getLabel());
            }
        }

        return queryableFieldMap;
    }

    @AuraEnabled(cacheable=true)
    public static List<sObject> getQueryResults(String queryString, String whereClause) {
        if(whereClause != '') {
            queryString += ' WHERE ' + whereClause;
        }

        System.debug(queryString);
        return Database.query(queryString);
    }
}
