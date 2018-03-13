({
	setStopTimeUp : function(component)
    {
        var showToast = $A.get('e.force:showToast');
        var refreshView = $A.get('e.force:refreshView');
		showToast.setParams({
			'title': 'Success!',
            'message': 'The Audit Cheklist Item has been stoped.',
            'type': 'success'
        })
        showToast.fire();
        refreshView.fire();
    },
    setStopTimeUpWarning : function(component)
    {
        var showToast = $A.get('e.force:showToast');
        var refreshView = $A.get('e.force:refreshView');
		showToast.setParams({
			'title': 'Warning!',
            'message': 'The Audit Cheklist Item has been already stoped.',
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