({
    doInit : function(component, event, helper) 
    {
		var recordId = component.get("v.recordId");
		var stAction = component.get("c.setStartTime");
        stAction.setParams({
            "ACIId": recordId
        });
    
        stAction.setCallback(this, function(response){
            var state = response.getState();
    		if(component.isValid() && state === 'SUCCESS'){
        		var result = response.getReturnValue();
        		if(result == 'INFO'){
        			helper.setUpdatNA(component);
                    $A.get("e.force:closeQuickAction").fire()
        		}
        		else if(result == 'WARNING'){
        			helper.startTimeSetUpWarning(component);
                    $A.get("e.force:closeQuickAction").fire()
        		}
                else if(result == 'SUCCESS'){
                	helper.startTimeSetUp(component);
                    $A.get("e.force:closeQuickAction").fire()
                }
                component.set("v.errorMessage", result);
            }
        });
        $A.enqueueAction(stAction);
	}
})