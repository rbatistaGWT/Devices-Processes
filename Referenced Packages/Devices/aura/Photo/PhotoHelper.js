({
    doInit: function(component, event, helper) {
        helper.loadInitialData(component, event, helper);
        if(component.get('v.validateField')) {
        	helper.validateFields(component, event, helper);    
        }
    },
    
    loadInitialData: function(component, event, helper) {
        var getInitialDataAction = component.get("c.getInitialData");
        
        getInitialDataAction.setParams({
            parentRecordId: component.get("v.parentRecordId"),
            baseQueryField: component.get("v.baseQueryField")
        });
        
        getInitialDataAction.setCallback(this, function(response){
            if(response.getState() === "SUCCESS") {
                var result = JSON.parse(response.getReturnValue());
                if(result.error) {
                    component.set("v.validationMessage", result.error);
                } else {
                    component.set("v.parentRecordName", result.name);    
                }
            } else {
                component.set("v.validationMessage",$A.get("$Label.greatwave2.Photo_Component_ErrorLoadingInitialData"));
            }                                  
        });
        
        $A.enqueueAction(getInitialDataAction);
    },
    
    validateFields: function(component, event, helper) {
        var validateFieldsAction = component.get("c.validateFields");
        
        validateFieldsAction.setParams({
            parentRecordId: component.get("v.parentRecordId"),
            validateField: component.get("v.validateField"),
            validFieldValues: component.get("v.validFieldValues")
        });
        
        validateFieldsAction.setCallback(this, function(response){
            if(response.getState() == "SUCCESS") {
                var returnValue = response.getReturnValue();
                if(returnValue != Null) {
                	var result = JSON.parse(returnValue);  
                    if(result.error) {
                        component.set('v.validationMessage', component.get("unableToCaptureMessage"));
                    }
                }    
            } else{
                component.set('v.validationMessage', $A.get("$Label.greatwave2.Photo_Component_ErrorValidatingField"));
            }    
        });
        
        $A.enqueueAction(validateFieldsAction);
    },
    
    uploadPhoto: function(component, event, helper) {
        component.set("v.photoIsUploading", true);
        
        var files = component.get("v.files");
        var file = files[0][0];
        
        var imageData = component.get("v.image");
   	    var imageDataB64 = imageData.match(/,(.*)$/)[1];
        
        var namePrefix = component.get("v.attachmentNamePrefix");
        var fileName = (namePrefix ? namePrefix + "_" : "") + helper.formatDate() + "_" + file.name;

        if(component.get("v.useHandlingComponent")) {
            helper.redirectToHandleComponent(component, imageDataB64, fileName);
            return;
        }
        
        var uploadPhotoAction = component.get("c.uploadPhoto");
        
        uploadPhotoAction.setParams({
            parentRecordId: component.get("v.parentRecordId"),
            photoValue: imageDataB64,
            fileName: fileName
        });
        
        uploadPhotoAction.setCallback(this, function(response){
            component.set("v.photoIsUploading", false);
            
            if(response.getState() === "SUCCESS") {
                var result = JSON.parse(response.getReturnValue());
                if(result.error) {
                    component.set("v.validationMessage", result.error);
                } else {
                	alert($A.get("$Label.greatwave2.Photo_Component_PhotoUploaded"));    
                }
                
                $A.get("e.force:closeQuickAction").fire();
            }
        });
        
        $A.enqueueAction(uploadPhotoAction);
    },
    
    redirectToHandleComponent: function(component, photoValue, fileName) {
        var evt = $A.get("e.force:navigateToComponent");
        evt.setParams({
            componentDef: component.get("v.handlingComponent"),
            componentAttributes: {
                parentRecordId: component.get("v.parentRecordId"),
                photoValue: photoValue,
                fileName: fileName
            }
        });
        evt.fire();
    },
    
    formatDate: function() {
        var date = new Date();
        
        var ampm = date.getHours() >= 12 ? 'pm' : 'am';
        var hours = date.getHours() % 12;
        if(hours === 0) {
            hours = 12
        }
        
        var outputDate = 
            (date.getMonth() + 1) + "/" + 
            date.getUTCDate() + "/" + 
            date.getFullYear() + "-T" + 
            hours + ":" + 
            date.getMinutes() + ":" + 
            date.getSeconds() +
            ampm;
        
        return outputDate;
    }
})