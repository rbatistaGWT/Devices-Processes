({
	startTimeSetUp : function(component)
    {
        var showToast = $A.get('e.force:showToast');
        var refreshView = $A.get('e.force:refreshView');
		showToast.setParams({
			'title': 'Success!',
            'message': 'The Audit Cheklist Item has been started.',
            'type': 'success'
        })
        showToast.fire();
        refreshView.fire();
    },
    startTimeSetUpWarning : function(component)
    {
        var showToast = $A.get('e.force:showToast');
        var refreshView = $A.get('e.force:refreshView');
		showToast.setParams({
			'title': 'WARNING!',
            'message': 'The Audit Cheklist Item has been already started.',
            'type': 'warning'
        })
        showToast.fire();
        refreshView.fire();
    },
    setUpdatNA : function(component)
    {
        var showToast = $A.get('e.force:showToast');
        var refreshView = $A.get('e.force:refreshView');
		showToast.setParams({
			'title': 'Error!',
            'message': 'The Audit Cheklist Item already proccesed.',
            'type': 'error'
        })
        showToast.fire();
        refreshView.fire();
    }
})