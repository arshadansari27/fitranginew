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
                    setTimeout(function() { window.location.reload();}, 1000);
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

    App.sorter = function(id) {
        var input = $('#' + id);
        var category = input.attr('data-category');
        if (category == null || category == undefined || category.length == 0) category = 'all';
        var model = input.attr('data-model');
        var sorters = model + '-' + category;

        window.sorters = window.sorters || {};
        window.sorters[sorters] = window.sorters[sorters] || [];

        var sorters_list = window.sorters[sorters];
        console.log('Adding sorter for [' + model + '] [' + category + ']: ' + id);
        sorters_list.push(id);
    };

    App.upload_image = function(on_validation, success_callback, error_callback){
        var data = new FormData();
        var data_added = false;
        var dataURL;
        var file = jQuery('input[type=file]')[0].files[0];
        if (file == undefined || file.length == 0) {
            BootstrapDialog.alert('Please select a file first');
            return;
        }
        console.log("Uploading file: " + file.size);
        if(file.size >= 0) {

            if (file) {
                var reader = new FileReader();

                reader.onload = function(readerEvt) {
                    var binaryString = readerEvt.target.result;
                    dataURL = btoa(binaryString);
                    start_uploading();
                };

                reader.readAsBinaryString(file);
            }

       }

        function start_uploading() {

            on_validation();

            jQuery.ajax({
                url: '/dialog/upload_image',
                data: {images: dataURL},
                type: 'POST',
                success: function (data) {
                    success_callback(data);
                },
                error: function (data) {
                    error_callback(data);
                }
            });
        }

    };

    App.uploader = function(dialogRef, aspect_ratio) {
        var on_validation = function(){
            $('.form-group').hide();
            dialogRef.setClosable(false);
            dialogRef.getModalBody().prepend('<img class="loading-icon" src="/img/loading.gif">');
        };

        var on_success = function(data) {
            console.log(data);
            if (data.status == 'success') {
                $(".img-container").html('<img src="' + data.url + '">');
                $("#upload-image-view").show();
                $(".upload-image").val(data.url);
                dialogRef.setClosable(true);
                $('.alert').html('<div class="alert-message">Successfully uploaded the image.</div>');
                $('.alert').addClass('alert-info');
                $('.loading-icon').hide();

                var $image = $('.img-container > img'),
                    $dataX = $('#dataX'),
                    $dataY = $('#dataY'),
                    $dataHeight = $('#dataHeight'),
                    $dataWidth = $('#dataWidth'),
                    $dataRotate = $('#dataRotate'),
                    options = {
                        aspectRatio: aspect_ratio,
                        preview: '.cropped-image',
                        crop: function (data) {
                                $dataX.val(Math.round(data.x));
                                $dataY.val(Math.round(data.y));
                                $dataHeight.val(Math.round(data.height));
                                $dataWidth.val(Math.round(data.width));
                                $dataRotate.val(Math.round(data.rotate));
                        }
                    };
                $image.cropper(options);
                var $uploadButton = dialogRef.getButton('btn-upload-image');
                $uploadButton.addClass('disabled');
                var $cropButton = dialogRef.getButton('btn-crop-image');
                $cropButton.removeClass('disabled');

            } else {
                $('.alert').html('<div class="alert-message">Failed to upload the image, try again later.</div>');
                $('.alert').addClass('alert-warning');
            }
            $('.alert').show();

        }

        var on_error = function(data){
            $('.alert').html('<div class="alert-message">Failed to upload the image, try again later.</div>');
            $('.alert').addClass('alert-warning');
            $('.alert').show();
            dialogRef.enableButtons(false);
            dialogRef.setClosable(true);
        };

        App.upload_image(on_validation, on_success, on_error);
    };

    var display = '<div id="form-control-image-uploader"><div class="form-group"><label for="tags">Select Image to upload</label><input data-image="file-uploader" type="file" class="form-control" placeholder="Image selector" ></div></div>';

    App.image_upload_dialog = function(on_upload){
        BootstrapDialog.show({
            title: 'Upload Picture',
            message: display,
            buttons: [
                {
                    label: 'Close',
                    action: function(dialogRef) {
                        dialogRef.close();
                    }
                },
                {
                    label: 'Upload Image',
                    cssClass: 'btn-primary',
                    action: function(dialogRef) {
                        var on_validation = function() {
                            dialogRef.enableButtons(false);
                            dialogRef.setClosable(false);
                            dialogRef.getModalBody().html('<p>Uploading File.</p><br/><center><img src="/img/loading.gif"></center>');
                        };

                        var on_success = function(data){
                            on_upload(data.url)
                            dialogRef.close();
                        };

                        var on_error = function(data){
                            dialogRef.setMessage('Something went wrong when uploading the file. Please try again later or contact the administrator at go@fitrangi.com');
                        };

                        App.upload_image(on_validation, on_success, on_error);
                    }
                }
            ]
        });
    };

    App.hashcode = function(st) {
        var hash = 0, i, chr, len;
        if (st.length == 0) return hash;
        for (i = 0, len = st.length; i < len; i++) {
            chr   = st.charCodeAt(i);
            hash  = ((hash << 5) - hash) + chr;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    };


    window.App = App;
});
