({  
    rerender : function(component, helper) {
        this.superRerender();
        helper.windowClick = function(e){
            if(e.target.toString().includes('HTMLDivElement')){
                helper.hideOptions(component);
                document.removeEventListener('click', helper.windowClick);
            }
        }
        document.addEventListener('click', helper.windowClick);
	},
    
    clearInput : function(component, event, helper) {
        component.set("v.searchResults", null);
        component.set("v.selectedRecord", null);
        component.set("v.value", "");
        component.set("v.iconPosition", "right");
    },
    
    selectOption : function(component, event, helper) {
        if(event.currentTarget.dataset.recordid){
            helper.clearErrors(component);
            var selectedRecord = {Id:event.currentTarget.dataset.recordid, DisplayField:event.currentTarget.dataset.displayfield};
            component.set("v.selectedRecord", selectedRecord);
            component.set("v.value", selectedRecord.DisplayField);
            helper.hideOptions(component);
            if(component.get("v.iconName")){
                component.set("v.iconPosition", "left-right");
            }
        }
    },
    
    handleKeyUp : function(component, event, helper) {
		var searchText = component.get("v.value");
        var isFocused = component.get("v.isFocused");
        
        if(searchText == null || searchText == ""){
            component.set("v.searchResults", null);
            helper.hideOptions(component);
            return;
        }
        
        helper.clearErrors(component);
        
        var action = component.get("c.getRecords");
        action.setParams({
            searchText : component.get("v.value"),
            objectName : component.get("v.objectName"),
            fullSearch : component.get("v.fullSearch"),
            displayField : component.get("v.displayField"),
            filters: component.get("v.filters"),
            limitNumber : component.get("v.limit")
        });

        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.searchResults", response.getReturnValue());
                helper.updateDropdownHeight(component);
                helper.showOptions(component);
            } else {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message: " + errors[0].message);
                    }
                } else {
                    console.log("Unknown error");
                }
            }
        });

        $A.enqueueAction(action);
	},
    
	handleOnFocus : function(component, event, helper) {
        helper.showOptions(component);
	},
    
    handleOnBlur : function(component, event, helper) {
        setTimeout(function(){
            helper.hideOptions(component);
        }, 300);
	},
    
    handleError : function(component, event, helper) {
        var inputDiv = component.find("inputDiv");
		$A.util.addClass(inputDiv, "slds-has-error");
	},
    
    handleClearError : function(component, event, helper) {
		helper.clearErrors(component);
	}
})