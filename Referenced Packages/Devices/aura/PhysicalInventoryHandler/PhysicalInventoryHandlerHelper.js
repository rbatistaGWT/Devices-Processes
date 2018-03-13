({
	getScannedRecord : function(component, helper){
        var action = component.get("c.getScannedRecord");

        action.setParams({
            "physicalInventoryId": component.get("v.physicalInventory").Id,
            "code": component.get("v.code")
        });

        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var result = response.getReturnValue().split("<~>");
                if(result.length > 1){
                    helper.populateResult(component, result);
                } else {
                    helper.fireInfoMessageEvent(component, result[0]);
                }
            } else {
                helper.handleCallbackErrors(component, helper, response.getError(), $A.get("$Label.greatwave2.UnkownError"));
            }
            helper.fireStopLoading(component);
        });

        $A.enqueueAction(action);
    },
    
    populateResult : function(component, splitResult){
        var result = {productName: splitResult[0], serialNumber: splitResult[1], lotNumber: splitResult[2], scannedCount: splitResult[3]};
        component.set("v.result", result);
    },
    
    fireInfoMessageEvent : function(component, infoMessage) {
        var myEvent = component.getEvent("infoMessageEvent");
        myEvent.setParams({"infoMessage": infoMessage, "iconName" : "action:close"});
        myEvent.fire();
    },
    
    handleCallbackErrors : function(component, helper, errors, unknownErrorMessage){
        if (errors) {
            if (errors[0] && errors[0].message) {
                helper.fireInfoMessageEvent(component, errors[0].message);
            }
        } else {
            helper.fireInfoMessageEvent(component, unknownErrorMessage);
        }
    },
    
    fireStopLoading : function(component){
        component.getEvent("stopLoading").fire();
    }
})