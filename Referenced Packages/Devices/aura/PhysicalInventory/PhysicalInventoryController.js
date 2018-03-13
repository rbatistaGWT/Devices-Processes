({
    doInit : function(component, event, helper){
        var code = component.get("v.code");
        if(code){
         	component.set("v.showHandlingComponent", true);
            component.set("v.scanButtonName", "Scan Another");
            var attributes = {'physicalInventory': component.get("v.physicalInventory")};
            component.set("v.handlingComponentAttributes", attributes);
        } else {
            component.set("v.infoMessage", $A.get("$Label.greatwave2.PI_InfoMessage_StartingMessage"));
            helper.validateOnLoad(component, helper);
        }
    },
    
    handleInfoMessageEvent : function(component, event, helper) {
        component.set("v.infoMessage", event.getParam("infoMessage"));
        component.set("v.iconName", "action:close");
        component.set("v.showHandlingComponent", false);
        helper.stopLoading(component);
    },
    
    handleStopLoadingEvent : function(component, event, helper) {
        helper.stopLoading(component);
    },
    
    finishScan : function(component, event, helper){
        helper.gotoURL("/apex/greatwave2__PI_ResultsTable?id=" + component.get("v.physicalInventory").Id);
    },
    
    cancel : function(component, event, helper){
        window.location = "/";
    }
})