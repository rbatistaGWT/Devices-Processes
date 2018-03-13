({
    doInit : function(component, event, helper) {
        var attributes = {
            "parentRecordId": component.get("v.parentRecordId"),
            "code": component.get("v.code"),
            "object": component.get("v.object"),
            "searchField": component.get("v.searchField"),
            "scanAction": component.get("v.scanAction"),
            "setActionField": component.get("v.setActionField"),
            "scanRelatedTo": component.get("v.scanRelatedTo"),
            "parentObjectName": component.get("v.parentObjectName"),
            "parentRecordObject": component.get("v.parentRecordObject"),
            "headerName": component.get("v.headerName"),
            "baseQueryFields": component.get("v.baseQueryFields")
        }
        component.set("v.attributes", attributes);
        
        var code = component.get("v.code");
        if(code){
            helper.parseCode(component, helper);
        	helper.getParentRecord(component, helper);
            component.set("v.headerName", "Order Line Scanned");
        } else {
            helper.launchScanner(component);
        }
    },
    
    cancel : function (component, event, helper){
        helper.redirectToSObject(component.get("v.parentRecordId"));
    },
    
    scanAnotherLine : function(component, event, helper) {
        var errorMessage = component.get("v.errorMessage");
        if(errorMessage == "") {
            helper.updateSearchedItem(component, helper);
        }
        helper.launchScanner(component, null);
	},

    goToInventoryOrder : function(component, event, helper) {
        var errorMessage = component.get("v.errorMessage");
        if(errorMessage == "") {
        	helper.updateSearchedItem(component, helper);    
        }
        helper.redirectToSObject(component.get("v.parentRecordId"));
	}
})