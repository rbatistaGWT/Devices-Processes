({
    doInit : function(component, event, helper) {
        var attributes = {"parentRecordId": component.get("v.parentRecordId")}
        component.set("v.attributes", attributes);
        
        var code = component.get("v.code");
        if(code){
            helper.parseCode(component, helper);
            component.set("v.showContent", true);
            component.set("v.scanButtonName", "Scan Another");
            component.set("v.headerName", "Order Line Scanned");
        } else {
            component.set("v.infoMessage", $A.get('$Label.greatwave2.PO_InfoMessage_StartingMessage'));
            helper.stopLoading(component);
            helper.showScanner(component);
        }
    },
    
    cancel : function (component, event, helper){
        helper.redirectToSObject(component.get("v.parentRecordId"));
    },
    
    scanLine : function(component, event, helper) {
        if(component.get("v.showContent")){
            helper.updateRecords(component, helper, false);
        } else {
        	helper.showScanner(component);    
        }
    },

    goToInventoryOrder : function(component, event, helper) {
       helper.updateRecords(component, helper, component.get("v.parentRecordId"));
	},
    
    goToOrderLine : function(component, event, helper) {
        helper.updateRecords(component, helper, component.get("v.orderLine").Id);
	}
})