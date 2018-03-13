({
	init: function(component, event, helper) {
		helper.doInit(component, event, helper);
	},
    
    savePhoto: function(component, event, helper) {
        helper.uploadPhoto(component, event, helper);
    },
    
    readImage: function(component, event, helper) {
        var files = component.get("v.files");
        if (files && files.length > 0) {
            var file = files[0][0];
            if (!file.type.match(/(image.*)/)) {
                component.set("v.validationMessage", $A.get("$Label.greatwave2.Photo_Component_imageNotSupported"));
                return;
            }
            
            var reader = new FileReader();
            
            reader.onloadend = function() {
                var dataURL = reader.result;
                component.set("v.image", dataURL);
                
                var uploadBtn = component.find('uploaPhotoBtn');
                $A.util.removeClass(uploadBtn, 'disableUploadPhotoBtn');
            };
            
            reader.onerror = function() {
            	component.put("v.validationMessage", $A.get("$Label.greatwave2.Photo_Component_errorReadingPhotoFile"));
            };
            
            reader.readAsDataURL(file);
        }   
    }
})