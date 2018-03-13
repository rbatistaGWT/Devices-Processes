({
	validateOnLoad : function(component, helper) {
		helper.validateInventoryOrder(component, helper);
	},
    
    validateInventoryOrder : function(component, helper){
        var action = component.get("c.validateInventoryOrder");
        action.setParams({"userId": $A.get("$SObjectType.CurrentUser.Id")});
		
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var isValid = response.getReturnValue();
                if(isValid){
                    helper.getPhysicalInventoryRequest(component, helper);
                } else {
                    component.set("v.infoMessage", $A.get("$Label.greatwave2.PI_InfoMessage_OrdersShipped"));
                    component.set("v.iconName", "action:close");
                    component.set("v.isScanDisabled", true);
                    component.set("v.isFinishDisabled", true);
                    helper.stopLoading(component);
                }
            } else {
                helper.handleCallbackErrors(component, helper, response.getError(), $A.get("$Label.greatwave2.UnkownError"));
            }
        });

        $A.enqueueAction(action);
    },
    
    getPhysicalInventoryRequest : function(component, helper){
        var action = component.get("c.getPhysicalInventoryRequest");
        action.setParams({"userId": $A.get("$SObjectType.CurrentUser.Id")});
        
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var pir = response.getReturnValue();
                if(pir){
                    var attributes = {'physicalInventory': pir};
                    component.set("v.handlingComponentAttributes", attributes);
                    component.set("v.physicalInventory", pir);
                    
                    if(helper.verifyPIRCompleted(component, pir)){
                        helper.verifyPIRLines(component, helper, pir);
                    } else {
                        helper.stopLoading(component);
                    }
                } else {
                    component.set("v.infoMessage", $A.get("$Label.greatwave2.PI_InfoMessage_NoPIRequest"));
                    component.set("v.iconName", "action:close");
                    component.set("v.isScanDisabled", true);
                    component.set("v.isFinishDisabled", true);
                    helper.stopLoading(component);
                }
            } else {
                helper.handleCallbackErrors(component, helper, response.getError(), $A.get("$Label.greatwave2.UnkownError"));
            }
        });

        $A.enqueueAction(action);
    },
    
    verifyPIRCompleted : function(component, pir){
        if(pir["greatwave2__PIR_Complete__c"]){
            component.set("v.infoMessage", $A.get("$Label.greatwave2.PI_InfoMessage_PICompleted"));
            component.set("v.iconName", "action:approval");
            component.set("v.isScanDisabled", true);
            component.set("v.isFinishDisabled", true);
            return false;
        }
        return true;
    },
    
    verifyPIRLines : function(component, helper, pir){
        
        if(!pir["greatwave2__PIRLs__r"]){
            helper.buildPIRLines(component, helper, pir);
        } else {
            var enableScan = false;
            
            for (var i = 0; i < pir["greatwave2__PIRLs__r"].length; i++) {
                if(!pir["greatwave2__PIRLs__r"][i]["greatwave2__Scanned__c"]){
                    enableScan = true;
                    break;
                }
            }
            if(!enableScan){
                component.set("v.infoMessage", $A.get("$Label.greatwave2.PI_InfoMessage_ProductsScanned"));
                component.set("v.iconName", "action:check");
                component.set("v.isScanDisabled", true);
                component.set("v.isFinishDisabled", false);
            }
            helper.stopLoading(component);
        }
    },
    
    buildPIRLines : function(component, helper, pir){
        var action = component.get("c.buildPIRLines");
        action.setParams({"physicalInventoryRequest": pir});
        
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var pir = response.getReturnValue();
            } else {
                helper.handleCallbackErrors(component, helper, response.getError(), $A.get("$Label.greatwave2.UnkownError"));
            }
            helper.stopLoading(component);
        });

        $A.enqueueAction(action);
    },
    
    handleCallbackErrors : function(component, helper, errors, unknownErrorMessage){
        component.set("v.isScanDisabled", true);
        component.set("v.isFinishDisabled", true);
        if (errors) {
            if (errors[0] && errors[0].message) {
                component.set("v.infoMessage", errors[0].message);
                component.set("v.iconName", "action:close");
            }
        } else {
            component.set("v.infoMessage", unknownErrorMessage);
            component.set("v.iconName", "action:close");
        }
    },
    
    gotoURL : function (url) {
        var urlEvent = $A.get("e.force:navigateToURL");
        urlEvent.setParams({
            "url": url,
            isredirect: true
        });
        urlEvent.fire();
    },
    
    stopLoading : function(component){
    	var spinner = component.find('spinner');
        var content = component.find('content');
        $A.util.removeClass(content, 'hideContent');
        $A.util.addClass(spinner, 'hideContent');
	}
})