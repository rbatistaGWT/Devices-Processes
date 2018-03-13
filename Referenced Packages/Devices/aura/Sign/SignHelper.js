({
    /*Description: Init method to load data by Id and validate 
      required fields and picklist field values.*/
    doInit : function(component, event) {
    	$(document).ready(function() {
          $('.sigPad').signaturePad({
              drawOnly: true,
              defaultAction: 'drawIt',
              validateFields: true,
              lineTop:170,
              penCap:'butt',
              lineWidth: 2,
              output: null, 
              name: null,
              typed: null, 
              typeIt: null,
              drawIt: null,
              typeItDesc: null,
              drawItDesc: null});
        });
        
        var f2BeValidate = component.get("v.validateField");  
        var validSignField = component.get("v.validSignField");
        var validSignValues = component.get("v.validSignValues");
        var fields2BeValidate = '';
        if(f2BeValidate !== null &&  f2BeValidate !== '' && f2BeValidate !== undefined){
        	fields2BeValidate = ''+this.chekForDuplicates(f2BeValidate.split(','));
        }
        
        var initAction = component.get("c.init");
        initAction.setParams({
            "storeSignatureField": component.get("v.storeSignatureField") + " ",
            "parentRecordId": component.get("v.parentRecordId")+ " ",
            "validateField": fields2BeValidate+ " ",
            "validSignField":validSignField+ " ",
            "baseQueryField": component.get("v.baseQueryField")
        });

        initAction.setCallback(this, function(response){
            var state = response.getState();
    		if(component.isValid() && state === 'SUCCESS'){
        		var result = response.getReturnValue();
                var parsedResult = JSON.parse(result);
                var validateField = component.get("v.validateField");
        		if(parsedResult.Id === ''){ //Case for Error
                    var messages = [];
                    messages.push({value:parsedResult.message});
                    component.set("v.errorMessage", messages);
                    var confirmAction = component.find('confirmSignaturebtn');
        			$A.util.addClass(confirmAction, 'disableConfirmBtn'); 
        		} 
                else {
                    component.set("v.parentRecordName",parsedResult.Name);
                    this.runFieldValidation(component,event,parsedResult,fields2BeValidate,validSignField,validSignValues);                    
                }  
            } 
        });
        $A.enqueueAction(initAction);
    },
    
    /*Description: Save signature base64 string in the given field in component.*/
    onConfirmSignature :  function(component, event, helper) {
        
        var signatureLenght = $('.sigPad').signaturePad().getSignature().length;
        var messages = [];
        
        if(signatureLenght === 0){
            messages.push({value:'Signature is required.'});
            component.set('v.errorMessage',messages);     
        }else{    	
            component.set('v.errorMessage',messages); 
            var signatureBase64 = $('.sigPad').signaturePad().getSignatureImage();            
            var signatureBase64Lenght = $('.sigPad').signaturePad().getSignature().length; 
            component.set("v.signatureValue",signatureBase64);
            
            if(signatureBase64Lenght !== 0){
                if(component.get("v.useHandlingComponent")) {
                    helper.redirectToHandleComponent(component, event);
                } else {
                    
                    var uploadSignature = component.get("c.uploadSignature");
                    uploadSignature.setParams({
                        "storeSignatureField": component.get("v.storeSignatureField"),
                        "parentRecordId": component.get("v.parentRecordId"),
                        "b64SignData": signatureBase64,
                        "baseQueryField": component.get("v.baseQueryField")
                    });
                    
                    uploadSignature.setCallback(this, function(response){
                        var state = response.getState();
                        if(component.isValid() && state === 'SUCCESS'){
                            var result = response.getReturnValue();
                            console.log('result',result);
                            var parsedResult = JSON.parse(result); 
                            var messages = [];
                            if(parsedResult.Id === ''){                            
                                messages.push({value:parsedResult.message});
                                component.set("v.errorMessage", messages);
                            }else{  
                                $A.get('e.force:refreshView').fire();
                                $A.get("e.force:closeQuickAction").fire();
                            } 
                        } 
                    });
                    $A.enqueueAction(uploadSignature);
                }    
            }
        }
    },
    
    redirectToHandleComponent: function(component, event) {
        var evt = $A.get("e.force:navigateToComponent");
        evt.setParams({
            componentDef: component.get("v.handlingComponent"),
            componentAttributes: {
                parentRecordId: component.get("v.parentRecordId"),
                signatureValue: component.get("v.signatureValue"),
                storeSignatureField: component.get("v.storeSignatureField"),
            }
        });
        evt.fire();
    },
    
    onClearSignature: function(component, event) {
        component.set("v.signatureValue", "");
    },
    
    /*Description: Initial validation for required field and picklist values*/
    runFieldValidation: function(component, event, objectInJSON, fields2BeValidate, validSignField, validSignValues) {         
        var fields2BeValidateList; 
        var validationMessages = []; 
        if(fields2BeValidate !== null && fields2BeValidate !== '' && fields2BeValidate !== undefined){
            fields2BeValidateList = fields2BeValidate.split(',');
            if(fields2BeValidateList.length > 0){
                for(var i=1;i< fields2BeValidateList.length;i++){                 
                    if(objectInJSON[fields2BeValidateList[i]] !== "" && objectInJSON[fields2BeValidateList[i]] !== null && objectInJSON[fields2BeValidateList[i]] !== undefined){
                        continue;   
                    }else{
                        validationMessages.push({value:this.simplify(fields2BeValidateList[i]) +' '+$A.get("$Label.greatwave2.RequiredFieldValidation")});
                    }                 
                }
            }  
        }
        if(validSignValues !== "" && validSignValues !== null && validSignValues !== undefined){            
            if(validSignValues.indexOf(objectInJSON[validSignField]) == -1){
                validationMessages.push({value:component.get('v.unableToSignMessage')});
            }            
        } 
        if(validationMessages.length > 0){
            var confirmAction = component.find('confirmSignaturebtn');
        	$A.util.addClass(confirmAction, 'disableConfirmBtn');             
            component.set("v.errorMessage", validationMessages);            
        } 
    },
    
    /*Description: To simplify the API field name look like Label.*/
    simplify:function(fieldName){
        var fieldNameList = fieldName.split('__');
        if(fieldNameList.length > 2){
            return fieldNameList[1];
        }
        return fieldNameList[0];
    },
    
    chekForDuplicates: function(fields) {
        var map = {};
        var result = [];
        
        if(fields.length <= 1) {
            return fields;
        }
        
        for(var i=0; i<fields.length; i++) {
            var field = fields[i];
            if(!(field in map)) {
                map[field] = field;
                result.push(field);
            }
        }
        
        return result;	
    }
})