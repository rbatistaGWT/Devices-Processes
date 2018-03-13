({
	saveOrderLine : function(component, helper, addMore) {
        var action = component.get("c.saveOrderLine");
        
        action.setParams({
            inventoryOrderId : component.get("v.inventoryOrderId"),
            productId: component.get("v.selectedProduct")["Id"],
            quantity: component.get("v.requestedQuantity")
        });

        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                helper.handleSuccess(component, helper, response.getReturnValue(), addMore);
            } else {
                helper.showMessage(component, helper, $A.get("$Label.greatwave2.NewOrderLine_Error"), "action:close");
            }
        });

        $A.enqueueAction(action);
	},
    
    checkFieldValues : function(component, helper) {
        var inventoryOrderField = component.find('inventoryOrderField');
        var quantityField = component.find("quantityField");
        var productField = component.get("v.selectedProduct");
        var searchInput = component.find("productField").find("searchInput");
        
        if(searchInput.length > 0){
            searchInput = searchInput[0];
        }
        
        if(helper.isValid(inventoryOrderField) && helper.isValid(quantityField) && productField != null){
            return true;
        } else {
            inventoryOrderField.showHelpMessageIfInvalid();
            quantityField.showHelpMessageIfInvalid();
            if(!productField){
                component.set("v.productErrors", [$A.get("$Label.greatwave2.NewOrderLine_ProductError")]);
                var errorEvent = searchInput.getEvent("onError");
                errorEvent.fire();
            }
            return false;
        }
    },
    
    isValid : function(inputComponent) {
    	return inputComponent.get('v.validity').valid;
	},
    
    redirectToSObject : function(recordId){
        var navEvt = $A.get("e.force:navigateToSObject");
        if(navEvt){
            navEvt.setParams({
              "recordId": recordId,
            });
            navEvt.fire();
        } else {
            window.location = "/" + recordId;
        }
    },
    
    handleSuccess : function(component, helper, responseValue, addMore){
        if(responseValue != null){
            if(addMore){
                var attributes = {
                    inventoryOrderId: component.get("v.inventoryOrderId"), 
                    inventoryOrder: component.get("v.inventoryOrder")
                };
                helper.showMessage(component, helper, $A.get("$Label.greatwave2.NewOrderLine_Success"), "action:approval");
                helper.resetAttributes(component, helper);
            } else{
                helper.redirectToSObject(component.get("v.inventoryOrderId"));
            }
        } else{
            helper.showMessage(component, helper, $A.get("$Label.greatwave2.NewOrderLine_Error"), "action:close");
        }
    },
    
    resetAttributes : function(component, helper){
        component.set("v.requestedQuantity", 1);
        component.set("v.selectedProduct", null);
        component.set("v.productErrors", null);
        helper.resetButtoms(component);
        var inputCmp = component.find("productField");
        inputCmp.clearInput(inputCmp);
    },
    
    resetButtoms : function(component){
        component.set("v.saveDisabled", false);
        component.set("v.saveAddDisabled", false);
        component.set("v.variant", "brand");
    },
    
    showMessage : function(component, helper, message, iconName) {
        component.set("v.infoMessage", message);
        component.set("v.iconName", iconName);
        component.set("v.showMessage", true);
        helper.resetButtoms(component);
        if(iconName === "action:approval"){
            helper.hideMessage(component, 2000);
        }
    },
    
    hideMessage : function(component, time){
        window.setTimeout(
            $A.getCallback(function() {
                component.set("v.showMessage", false);
            }), time
        );       
    }
})