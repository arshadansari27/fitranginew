jQuery(document).ready(function($){

	console.log('From logout.js');

	var logoutAction = function() {
		$.ajax({
    		type: 'POST',
    		url: '/logout',
    		data: '',
    		success: function(data) { 
    			window.location.href = '/';
    		},
    		contentType: "application/json",
    		dataType: 'json'
		});

	};

	$logout = $('#logoutBtn')
	if ($logout) {
		$(document).on('click', '#logoutBtn', function(e) {
			e.stopPropagation();
			logoutAction();	
			return false;
		});
	}

		
});
