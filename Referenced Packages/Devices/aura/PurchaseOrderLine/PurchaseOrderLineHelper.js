({
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
                        helper.getOrderLine(component, helper);
                    } else {
                        helper.showError(component, $A.get("$Label.greatwave2.Scan_GeneticItemScan_ParsingError"));
                    }
                } else {
                    helper.showError(component, $A.get("$Label.greatwave2.Scan_GeneticItemScan_ParsingError"));
                }
            } else {
                helper.handleCallbackErrors(component, helper, response.getError());
            }
        });

        $A.enqueueAction(action);
    },
    
    getOrderLine : function(component, helper){
        var action = component.get("c.getOrderLine");
        action.setParams({
            "inventoryOrderId": component.get("v.parentRecordId"),
            "productGTIN": component.get("v.parsedCode").gtin
        });

        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var orderLine = response.getReturnValue();
                if(orderLine){
                    if(!orderLine.greatwave2__Order_Line_Scanned__c){
                        if(component.get("v.scanLockClassImpl")) {
                            helper.lockScan(component, helper, orderLine);
                        } else {
                        	component.set("v.orderLine", orderLine);    
                        }
                    } else{
                        helper.showError(component, $A.get("$Label.greatwave2.PO_InfoMessage_ProductScanned"));
                    }
                } else {
                    helper.showError(component, $A.get("$Label.greatwave2.PO_InfoMessage_NoOrderLineFound"));
                }
            } else {
                helper.handleCallbackErrors(component, helper, response.getError());
            }
            helper.stopLoading(component);
        });

        $A.enqueueAction(action);
    },
    
    lockScan: function(component, helper, orderLine) {
        var action = component.get("c.isScanLocked");
        
        action.setParams({
            "implementationClassName": component.get("v.scanLockClassImpl"),
            "parentRecordId": component.get("v.parentRecordId"),
            "childRecordId": orderLine.Id
        });
		
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var isLocked = response.getReturnValue();
                if(isLocked) {
                    helper.showError(component, component.get("v.scanLockMessage"));
                } else {
                    component.set("v.orderLine", orderLine);
                }
            }
        });
        
        $A.enqueueAction(action);
    },
    
    updateRecords : function(component, helper, redirect){
        helper.updateOrderLine(component, helper, redirect);
    },
    
    updateOrderLine : function(component, helper, redirect, showscanner) {
        var attributes = {
            "ObjectApiName": "greatwave2__Order_Line__c",
            "Id": component.get("v.orderLine").Id
        };
                
        if(component.get("v.parsedCode.isLotControlled")){
           attributes["greatwave2__Lot_Number__c"] = component.get("v.parsedCode.lotNumber");
        } else {
           attributes["greatwave2__Serial_Number__c"] = component.get("v.parsedCode.serialNumber");
        }

        var action = component.get("c.createOrUpdateRecord");
        action.setParams({"fields": attributes});

        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                helper.createInventoryItem(component, helper, redirect);
            } else {
                helper.showError(component, $A.get("$Label.greatwave2.PO_InfoMessage_OrderLineDMLError"));
            }
        });

        $A.enqueueAction(action);
    },
    
    createInventoryItem : function(component, helper, redirect){
        
        var attributes = {
            "ObjectApiName": "greatwave2__Inventory_Item__c",
            "Name": component.get("v.orderLine")["greatwave2__Product_Name__c"],
            ["greatwave2__Order_Line__c"]: component.get("v.orderLine").Id,
            ["greatwave2__Inventory_Location__c"]: component.get("v.orderLine")['greatwave2__Order__r']['greatwave2__Inventory_Location__c'],
            ["greatwave2__Product__c"]: component.get("v.orderLine")['greatwave2__Product__c'],
            ["greatwave2__SerialNumber__c"]: component.get("v.parsedCode.serialNumber"),
            ["greatwave2__Lot_Number__c"]: component.get("v.parsedCode.lotNumber"),
            ["greatwave2__Quantity__c"]: 1,
            ["greatwave2__Status__c"]: "Available"
        };

        var action = component.get("c.createOrUpdateRecord");
        action.setParams({"fields": attributes});

        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state == "SUCCESS") {
                if(redirect){
                    helper.redirectToSObject(redirect);
                } else {
                   	helper.showScanner(component);
                }
            } else {
                helper.showError(component, $A.get("$Label.greatwave2.PO_InfoMessage_InventoryItemDMLError"));
            }
        });

        $A.enqueueAction(action);
    },
    
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
    
    showError : function(component, errorMessage){
        component.set("v.infoMessage", errorMessage);
        component.set("v.showContent", false);
        component.set("v.iconName", "action:close");
    },
    
    showScanner : function(component){
        var scanComponent = component.find("scanner");
        scanComponent.launchScanner();
    },
    
    stopLoading : function(component){
    	var spinner = component.find('spinner');
        var content = component.find('content');
        $A.util.removeClass(content, 'hideContent');
        $A.util.addClass(spinner, 'hideContent');
	},
    
    handleCallbackErrors : function(component, helper, errors){
        if (errors) {
            if (errors[0] && errors[0].message) {
                helper.showError(component, errors[0].message);
            }
        } else {
            helper.showError(component, $A.get("$Label.greatwave2.UnkownError"));
        }
    }
})