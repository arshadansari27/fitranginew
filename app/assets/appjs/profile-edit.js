$(document).ready(function(){
	console.log('On post-edit.js');
	var App = window.App;

	var postProfile = function(options) {
		console.log(options);
		App.post({
			url: '/profile_edit',
			parameters: {
				key: options.key,
				name: options.name,
				username: options.username,
				email: options.email,
				phone: options.phone,
				address: options.address,
				facebook:options.facebook,
				linkedin:options.linkedin,
				type: options.type,
				details: options.details,
				image: options.image
			},
    		success: function(message, node) { 
    			console.log('in success callback' + message + ", " + JSON.stringify(node));
			},
			error: function(message, node) {
    			console.log('in error callback' + message);
    		}
		});
	};

	$('#profileeditor-form').on('click', '[data-back]', function(e) {
		console.log($(this).attr('data-back'));
		window.location.href = $('[data-back]').attr('data-back');
	});

	$('#profileeditor-form').on('click', '#btn-save', function(e) {
		e.stopPropagation();
		var $key = $('#profileeditor-form').attr('data-key');
		var $name = $('#name').val();
		var $username = $('#username').val();
		var $email = $('#email').val();
		var $phone = $('#phone').val();
		var $address = $('#address').val();
		var $facebook= $('#facebook').val();
		var $linkedin = $('#linkedin').val();
		var $type = $('#type').val();
		var $details = $('#details').val();
		var $image = $('#image')[0].files[0];
		if ($image != undefined) {
			fr = new FileReader();
            fr.onload = function(){
				postProfile({
					key: $key,
					name: $name,
					username: $username,
					email: $email,
					phone: $phone,
					address: $address,
					facebook: $facebook,
					linkedin: $linkedin,
					type: $type,
					details: $details,
					image:fr.result
				});
			};
            //fr.readAsText($image);
            fr.readAsDataURL($image);
		} else {
			postProfile({
					key: $key,
					name: $name,
					username: $username,
					email: $email,
					phone: $phone,
					address: $address,
					facebook: $facebook,
					linkedin: $linkedin,
					type: $type,
					details: $details,
					image:''
			});
		}

		//console.log($image + ": " + btoa($image));
		// Remember btoa is browser specific
		
	});

});
