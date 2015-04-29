/**
 * Created by arshad on 09/04/15.
 */

jQuery(document).ready(function($){

	var App = App || {};

	App.log = function(logThis) {
		console.log(logThis);
	};

	App.editor = function(options) {

        var callback = null;
        if (arguments.length > 1) {
            callback = arguments[1]
        }
        $('#loadingImage').show();
		$.ajax({
    		type: 'POST',
    		url: '/editors/invoke',
    		data: JSON.stringify(options),
    		success: function(data) {
                $('#loadingImage').hide();
                if (data.status=='error' && data.message == 'Please login before making requests'){
                    App.show_login();
                }
                console.log(data);
    		    if (callback != null){
                    callback(data);
                } else {
                    setTimeout(function() {
                        window.location.reload();
                    }, 1000);
                }
    		},
    		contentType: "application/json",
    		dataType: 'json'
		});
	};

    App.base_editor = {
        save_image_cover:  function(model, model_id, url){
            App.editor({
                type: 'profile',
                command: 'save-cover',
                data:{
                    model: model_id,
                    url: url
                }
            })
        }
    }

    App.filter = function(id) {
        var input = $('#'+id);
        var category = input.attr('data-category');
        if (category == null || category == undefined || category.length == 0) category = 'all';
        var model = input.attr('data-model');
        //var filters = model + '-' + category;
        var filters = model;

        window.filters = window.filters || {};
        window.filters[filters] = window.filters[filters] || [];

        var filters_list = window.filters[filters];
        console.log('Adding filter for [' + model + '] [' + category + ']: ' + id);
        filters_list.push(id);

    };

    App.uploader = function(dialogRef) {
        var data = new FormData();
        jQuery.each(jQuery('input[type=file]')[0].files, function(i, file) {
            data.append('file-'+i, file);
        });
        if (data.length == 0) {
            return;
        }
        dialogRef.enableButtons(false);
        dialogRef.setClosable(false);
        dialogRef.getModalBody().prepend('<img class="loading-icon" src="/img/loading.gif">');
        jQuery.ajax({
            url: '/dialog/upload_image',
            data: data,
            cache: false,
            contentType: false,
            processData: false,
            type: 'POST',
            success: function(data){
                console.log(data);
                if (data.status == 'success') {
                    $(".cropContainerModal").html('<img src="' + data.url + '" width="100%">');
                    $(".upload-image-view").show();
                    $(".upload-image").val(data.url);
                    dialogRef.enableButtons(true);
                    dialogRef.setClosable(true);
                    $('.alert').html('<div class="alert-message">Successfully uploaded the image.</div>');
                    $('.alert').addClass('alert-info');
                    $('.loading-icon').hide();
                } else {
                    $('.alert').html('<div class="alert-message">Failed to upload the image, try again later.</div>');
                    $('.alert').addClass('alert-warning');
                }
                $('.alert').show();
            },
            error: function(data) {
                $('.alert').html('<div class="alert-message">Failed to upload the image, try again later.</div>');
                $('.alert').addClass('alert-warning');
                $('.alert').show();
            }
        });
    };


	window.App = App;
});
