({
	redirectToSObject : function(recordId){
        var navEvt = $A.get("e.force:navigateToSObject");
        if(navEvt){
            navEvt.setParams({
              "recordId": recordId,
            });
            navEvt.fire();
        } else {
            window.location = "/" + recordId;
        }
    },
    
    parseCode : function(component, helper){
        var action = component.get("c.parseCode");
        
        action.setParams({"code": component.get("v.code")});
        
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var parsedCode = response.getReturnValue();
                if(parsedCode){
                    // Example of received parsedCode: [bc=01008134260200461101011910937833, dt=010119, error=false, id=00813426020046, lotctr=true, lt=937833, sr=NA]
                    var jsonParsed = JSON.parse(parsedCode);
                    if(!jsonParsed.error){
                        var fixedCode = {
                            "barcode": jsonParsed.bc, 
                            "dateTime": jsonParsed.dt, 
                            "error": jsonParsed.error, 
                            "gtin": jsonParsed.id, 
                            "isLotControlled": jsonParsed.lotctr, 
                            "lotNumber": jsonParsed.lt, 
                            "serialNumber": jsonParsed.sr
                        };
                        component.set("v.parsedCode", fixedCode);
                        helper.getProduct(component, helper);
                    } else {
                        helper.showScanner(component, $A.get("$Label.greatwave2.Scan_GeneticItemScan_ParsingError"));
                    }
                } else {
                    helper.showScanner(component, $A.get("$Label.greatwave2.Scan_GeneticItemScan_ParsingError"));
                }
            } else {
                helper.handleCallbackErrors(component, helper, response.getError(), $A.get("$Label.greatwave2.Scan_GeneticItemScan_UnkownError"));
            }
        });

        $A.enqueueAction(action);
    },
    
    getScannedRecord : function(component, helper){
        var action = component.get("c.getScannedRecord");
        var objectName = component.get("v.object");
        var parentObjectName = component.get("v.parentObjectName");
        var params = {
            "sObjectName": (objectName).trim(),
            "searchField": (component.get("v.searchField")).trim(),
            "code": component.get("v.code"),
            "setActionField": (component.get("v.setActionField")).trim(),
            "scanRelatedTo": (component.get("v.scanRelatedTo")).trim(),
            "transferFrom": null
        }
        
        if(parentObjectName === "greatwave2__Inventory_Order__c"){
            params.transferFrom = component.get("v.parentRecordObject")["greatwave2__From_Location__c"];
        }
        action.setParams(params);

        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var records = response.getReturnValue();
                if(records && records.length > 0){
                    if (component.get("v.scanAction") == "Transfer") {
                        helper.handleInventoryItemTransfer(component, helper, records);
                        helper.isScanActionLocked(component, helper);
                    } else {
                        component.set("v.scannedRecord", records[0]);  
                        helper.isScanActionLocked(component, helper);
                    }
                } else {
                    helper.showScanner(component, component.get("v.notFoundMessage"));
                }
            } else {
                helper.showScanner(component, component.get("v.notFoundMessage"));
            }
        });

        $A.enqueueAction(action);
    },
    
    isScanActionLocked : function(component, helper){
        var scanLockClassImplementation = component.get("v.scanLockClassImpl");
        if(scanLockClassImplementation != "")
        {
            helper.checkScanLockValidation(component, helper, scanLockClassImplementation);
        }
    },
    
    checkScanLockValidation : function(component, helper, classImplementationName){
        var ret = false;
        var scanValidationAction = component.get("c.isScanLocked");
        var parentRecordId = component.get("v.parentRecordId");
        var scannedRecordId = component.get("v.scannedRecord").Id;      
        
        scanValidationAction.setParams({
            "implClassName": classImplementationName,
        	"parentRecordId": parentRecordId,
            "scannedRecordId": scannedRecordId    
        });
        
        scanValidationAction.setCallback(this, function(response) {
            var state = response.getState();
            var scanLocked = response.getReturnValue();
            if (state === "SUCCESS") {
                if(scanLocked){
                	helper.showScanner(component, component.get("v.scanLockMessage"));
                }
            } else {
                helper.handleCallbackErrors(component, helper, response.getError(), $A.get("$Label.greatwave2.Scan_GeneticItemScan_ErrorScanAction")); 
            }
        });

        $A.enqueueAction(scanValidationAction);
    },
    
    getParentRecord : function(component, helper){

        var action = component.get("c.getParentRecord");
        var params = {
            "sObjectName" : (component.get("v.parentObjectName")).trim(),
            "recordId": component.get("v.parentRecordId"),
            "fieldsCSV": component.get("v.baseQueryFields")
        };
        

        if(component.get("v.parentObjectName") === "greatwave2__Inventory_Order__c"){
            params.fieldsCSV += ",greatwave2__From_Location__c"; 
        }
        
        action.setParams(params);

        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var parentRecord = response.getReturnValue();
                if(parentRecord){
                    component.set("v.parentRecordObject", parentRecord);
                    if(parentRecord.Name == undefined)
                        component.set("v.showParentName", false);
                    helper.getScannedRecord(component, helper);
                } else {
                    helper.showScanner(component, $A.get("$Label.greatwave2.Scan_GeneticItemScan_ParentNotFound"));
                }
            } else {
                helper.handleCallbackErrors(component, helper, response.getError(), $A.get("$Label.greatwave2.Scan_GeneticItemScan_UnkownError"));
            }
        });

        $A.enqueueAction(action);
    },
    
    getProduct : function(component, helper) {
        var action = component.get("c.getProduct");
       
        action.setParams({"productGTIN": component.get("v.parsedCode.gtin")});

        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var product = response.getReturnValue();
                if(product){
                    component.set("v.product", product);
                } else {
                    helper.showScanner(component, $A.get("$Label.greatwave2.Scan_GeneticItemScan_ProductNotFound"));
                }
            } else {
                helper.handleCallbackErrors(component, helper, response.getError(), $A.get("$Label.greatwave2.Scan_GeneticItemScan_UnkownError"));
            }
        });

        $A.enqueueAction(action);
    },
    
    showScanner : function(component, errorMessage){
        component.set("v.errorMessage", errorMessage);
        component.set("v.showErrorInsteadOfInfo", true);
        component.set("v.reviewOrderDisabled", true);
    },
    
    launchScanner : function(component){
        var scanComponent = component.find("scanner");
        scanComponent.launchScanner();
    },
    
    updateSearchedItem : function(component, helper){
        var objectName = component.get("v.object");
        var attributes = {"ObjectApiName": (objectName).trim()};
        
        attributes.Id = component.get("v.scannedRecord").Id;
        attributes[(component.get("v.setActionField")).trim()] = component.get("v.scanAction");
        attributes[(component.get("v.scanRelatedTo")).trim()] = component.get("v.parentRecordId");
        attributes[("greatwave2__Scanned__c").trim()] = true;

        
        helper.createOrUpdateRecord(component, attributes);
    },
    
	createOrUpdateRecord : function (component, attributes) {
        var action = component.get("c.createOrUpdateRecord");
        action.setParams({"fields": attributes});

        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state !== "SUCCESS") {
                console.log('Error during DML operation.');
            }
        });

        $A.enqueueAction(action);
    },
    
    handleInventoryItemTransfer : function(component, helper, records) {

        if(component.get("v.object") === "greatwave2__Inventory_Item__c") {
            var parentRecord = component.get("v.parentRecordObject");
            var parentFromLocationId = parentRecord["greatwave2__From_Location__c"];
            for(var i = 0; i < records.length; i++){
                var scannedRecordLocationId = records[i]["greatwave2__Inventory_Location__c"];
                if(scannedRecordLocationId == parentFromLocationId) {
                    component.set("v.scannedRecord", records[i]);
                    return;
                }
            }
        }
        helper.showScanner(component, component.get("v.notInExpectedLocation"));
    },
    
    handleCallbackErrors : function(component, helper, errors, unknownErrorMessage){
        if (errors) {
            if (errors[0] && errors[0].message) {
                helper.showScanner(component, errors[0].message);
            }
        } else {
            helper.showScanner(component, unknownErrorMessage);
        }
    }
})