({
    scriptsLoaded : function(component, event, helper) {
    	helper.doInit(component, event);
    },
    
    confirmSignature: function(component, event, helper){
        helper.onConfirmSignature(component, event, helper);
    },
    
    clearSignature: function(component, event, helper) {
        helper.onClearSignature(component, event);
    }
})