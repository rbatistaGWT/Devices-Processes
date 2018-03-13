({
	showOptions : function(component) {
        var searchResults = component.get("v.searchResults");
        var isFocused = component.get("v.isFocused");
        
        if(!isFocused && searchResults != null && searchResults.length > 0){
            component.set("v.isFocused", true);
            var inputDiv = component.find("inputDiv");
            $A.util.addClass(inputDiv, "slds-is-open");
            $A.util.removeClass(inputDiv, "slds-combobox-lookup");
        }
	}, 
    
    hideOptions : function(component) {
		component.set("v.isFocused", false);
        var inputDiv = component.find("inputDiv");
        $A.util.removeClass(inputDiv, "slds-is-open");
        $A.util.addClass(inputDiv, "slds-combobox-lookup");
	},
    
    clearErrors : function(component) {
        var errorList = component.get("v.errorList");
        
        if(errorList){
            var inputDiv = component.find("inputDiv");
            $A.util.removeClass(inputDiv, "slds-has-error");
            component.set("v.errorList", null);
        }
    },
    
    updateDropdownHeight : function(component) {
        var height = component.get("v.dropDownHeight");
        var searchResults = component.get("v.searchResults");
        var resultsLength = searchResults.length;
        
        if(resultsLength == 1){
            component.set("v.dropDownHeight", 2.3);
        } else if(resultsLength == 2){
            component.set("v.dropDownHeight", 4.0);
        }  else {
            component.set("v.dropDownHeight", 5.7);
        }
    },
})