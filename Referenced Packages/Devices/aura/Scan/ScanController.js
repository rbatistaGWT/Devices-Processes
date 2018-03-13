({  
	scanBarcode : function(component, event, helper) {
        helper.scanBarcode(component);
	},
    
    onClickAction : function(component, event, helper) {
        if(component.get("v.executeOnClick")){
            helper.scanBarcode(component);
        }
    }
})