({
    doInit : function(component, event, helper) {
        var inventoryOrder = component.get("v.inventoryOrder");
        if(!inventoryOrder){
            var action = component.get("c.getInventoryOrder");
            action.setParams({ inventoryOrderId : component.get("v.inventoryOrderId") });
            
            action.setCallback(this, function(response) {
                var state = response.getState();
                if (state === "SUCCESS") {
                    component.set("v.inventoryOrder", response.getReturnValue());
                } else {
                    helper.showMessage(component, helper, $A.get("$Label.greatwave2.NewOrderLine_InventoryOrderError"), "action:close");
                }
            });
            
            $A.enqueueAction(action);
    	}
	},
    
	goToInventoryOrder : function(component, event, helper) {
        helper.redirectToSObject(component.get("v.inventoryOrderId"));
	},
    
    save : function(component, event, helper) {
        if(!component.get("v.saveAddDisabled") && !component.get("v.saveDisabled") && helper.checkFieldValues(component, helper)){
            component.set("v.saveDisabled", true);
            component.set("v.variant", "destructive");
            helper.saveOrderLine(component, helper, false);
        }
    },
    
    saveAndNew : function(component, event, helper) {
        if(!component.get("v.saveDisabled") && !component.get("v.saveAddDisabled") && helper.checkFieldValues(component, helper)){
            component.set("v.saveAddDisabled", true);
            component.set("v.variant", "destructive");
        	helper.saveOrderLine(component, helper, true);
        }
	}
})