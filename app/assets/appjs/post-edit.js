$(document).ready(function(){
	console.log('On post-edit.js');
	var App = window.App;

	var postPost = function(options) {
		console.log(options.image);
		App.post({
			url: '/post_edit',
			parameters: {
				key: options.key,
				title: options.title, 
				text: options.text,
				published: (options.published != undefined)? true: false,
				image: options.image
			},
    		success: function(message, node) { 
    			console.log('in success callback' + message);
			},
			error: function(message, node) {
    			console.log('in error callback' + message);
    		}
		});
	};

	$('#posteditor-form').on('click', '[data-back]', function(e) {
		console.log($(this).attr('data-back'));
		window.location.href = $('[data-back]').attr('data-back');
	});

	$('#posteditor-form').on('click', '#btn-save', function(e) {
		e.stopPropagation();
		var $title = $('#title').val();
		var $key = $('#posteditor-form').attr('data-key');
		var $text = $('#text').val();
		var $published = ($('#published:checked').val() == undefined)? false: true;
		var $image = $('#image')[0].files[0];
		if ($image != undefined) {
			fr = new FileReader();
            fr.onload = function(){
				postPost({
					key:$key,
					title:$title,
					text:$text,
					published:$published,
					image:fr.result
				});
			};
            //fr.readAsText($image);
            fr.readAsDataURL($image);
		} else {
			postPost({
					key:$key,
					title:$title,
					text:$text,
					published:$published,
					image:''
			});
		}

		//console.log($image + ": " + btoa($image));
		// Remember btoa is browser specific
		
	});

});
