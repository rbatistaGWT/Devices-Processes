({
	scanBarcode : function(component) {
		component.set("v.isDisabled", true);
        var attributes = component.get("v.handlingComponentAttributes");
        if(!attributes){
            attributes = {};
        }
        
        var componentRedirect = {
            "componentDef" : component.get("v.handlingComponent"),
            "attributes": attributes
        };
        window.location = '/apex/greatwave2__BarcodeJS?retCmp=' + JSON.stringify(componentRedirect);
	}
})