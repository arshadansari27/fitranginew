/**
 *
 * Created by arshad on 08/02/15.
 */
$(document).ready(function(){
	console.log('On admin-editor.js');

	var App = window.App;

    var files = null;

    function prepareUpload(event) {
        console.log("Getting file list: " + event.target.files);
        files = event.target.files;
    }

    function uploadFiles(event, onSuccess, onError) {
        event.stopPropagation();
        event.preventDefault();
        var data = new FormData();
        $.each(files, function (key, value) {
            data.append(key, value);
        });
        console.log("Sending data...");
        $.ajax({
            url: '/dialog/upload_image',
            type: 'POST',
            data: data,
            cache: false,
            dataType: 'json',
            processData: false, // Don't process the files
            contentType: false, // Set content type to false as jQuery will tell the server its a query string request
            success: function (data, textStatus, jqXHR) {
                if (typeof data.error === 'undefined') {
                        onSuccess(data);
                } else {
                        onError(data.error);
                        console.log('ERRORS: ' + data.error);
                    }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                    onError(textStatus);
                    console.log('ERRORS: ' + textStatus);
            }
        });
    }

	var postComment = function(options) {
		App.post({
			url: '/comment/' + options.key,
			parameters: {comment: options.comment, key: options.key, reload: options.reload},
    		success: function(message, node) {
    			console.log('in success callback' + message);
			},
			error: function(message, node) {
    			console.log('in error callback' + message);
    		}
		});
	};

	$('#comment_form').on('click', '#comment_submit', function(e) {
		e.stopPropagation();
		var $comment = $('#comment_text').val();
		var $key = $('#comment_form').attr('data-key');
		postComment({comment:$comment, key:$key, reload:true});
	});

    $('.comment_form').on('click', '.comment_submit', function(e) {
		e.stopPropagation();
        e.preventDefault();
        var $key = $(this).attr('data-key');
        var $comment = $('#comment_text_' + $key).val();
		postCommentUpdate({comment:$comment, key:$key, reload:false});
	});

    $("#change_image").click(function(e) {
        e.stopPropagation();
        var saveNow = false;
        BootstrapDialog.show({
            title: "Upload Image",
            message: function(dialog) {
                var $message = $('<div></div>');
                $message.load('/dialog/upload_image');
                return $message;
            },
            buttons: [{

                id: 'img-upload-btn',
                icon: 'glyphicon glyphicon-send',
                label: 'Upload Image from file',
                cssClass: 'btn-primary',
                autospin: true,
                action: function (dialogRef) {
                    if (!files || files == null) {
                        dialogRef.close();
                        alert('No file was selected');
                        return;
                    }
                    $('#img_uploader_form').on('submit', function(evt) {
                        uploadFiles(
                            evt,
                            function(data) {
                                dialogRef.getModalBody().html('<div><img src="/temp_image/' + data.id + '" width="100%"/><form id="img-save-form" method="POST" action="/saveimagefromtemp"><input type="hidden" name="model" value="'+ $('#change_image').attr('data-model') +'"/><input type="hidden" name="image" value="'+data.id+'"/></form></div>');
                                dialogRef.setClosable(true);
                                dialogRef.enableButtons(true);
                                $('#img-upload-btn').hide();
                                saveNow = true;
                            }, function(data) {
                                dialogRef.getModalBody().html('<div class="danger">Something went wrong when adding image.</div>');
                                dialogRef.setClosable(true);
                                dialogRef.enableButtons(true);
                                $('#img-upload-btn').hide();
                            }
                        );
                    });
                    dialogRef.enableButtons(false);
                    dialogRef.setClosable(false);
                    $("#img_uploader_form").submit();
                    dialogRef.getModalBody().html('<div class="progress"><div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%"><span class="sr-only"></span></div><div>');
                }
            },{
                id: 'image-save-btn',
                icon: 'glyphicon glyphicon-save',
                label: 'Save',
                cssClass: 'btn-primary',
                autospin: true,
                action: function(dialogRef) {
                    if (saveNow) {
                        $("#img-save-form").submit();
                        dialogRef.close();
                    } else {
                        alert('No file was uploaded');
                    }
                }
            },
            {
                label: 'Close',
                action: function (dialogRef) {
                    dialogRef.close();
                }
            }]
        });
    });

    $("[data-remove-following]").click(function(e) {
        console.log($(this).attr('data-key'));
    });

    $("[data-remove-favorite]").click(function(e) {
        console.log($(this).attr('data-key'));
    });

    if ($('.summernote').length > 0) {
        $('.summernote').summernote();
        $('.summernote-content-form').on('submit', function (e) {
            e.preventDefault();
            var url = $("[data-edit-url]").attr('data-edit-url');
            var data = $(this).find('.summernote').code();
            App.post({
                url: url,
                parameters: {key: $('body').attr('data-key'), data: data, reload: false},
                success: function (message, node) {
                    window.location.reload();
                },
                error: function (message, node) {
                    window.location.reload();
                }
            });
        });
    }

    $('.remove-comment').on('click', function(e){
        e.stopPropagation();
        var id = $(this).attr('data-key');
        var key = $(this).attr('data-comment-key');
        var url  = $("[data-comment-remove-url]").attr('data-comment-remove-url');
        var c = confirm('Are you sure?')
        if (!c) {
            return;
        }
        App.post({
            url: url,
			parameters: {key: key, id: id, reload: false},
                success: function(message, node) {
                    window.location.reload();
			    },
			    error: function(message, node) {
                    window.location.reload();
    		    }
        });
    });

    $('#add_new').on('click', function (e) {
        e.stopPropagation();
        var type = $(this).attr('data-type');
        var url  = $("[data-edit-url]").attr('data-edit-url');
        BootstrapDialog.show({
            title: 'Add New ' + type,
            message: '<div><input class="col-sm-12" id="add-data" name="data"><br/></div>',
            buttons:[
                {
                    label: 'Save',
                    action: function(dialogRef) {
                        App.post({
			                url: url,
			                parameters: {title: $('#add-data').val(), action: 'create'},
    		                success: function(message, node) {
                                window.location.href= url + '/' + node;
			                },
			                error: function(message, node) {
                                window.location.reload();
    		                }
		                });
                        dialogRef.close();
                    }
                },
                {
                    label: 'Close',
                    action: function (dialogRef) {
                        dialogRef.close();
                    }
                }
            ]
        });
    });

    $('.edit-form-text').on('click', function (e) {
        e.stopPropagation();
        var field = $(this).attr('data-field');
        var currentValue = $(this).attr('data-value');
        var url  = $("[data-edit-url]").attr('data-edit-url');
        BootstrapDialog.show({
            title: 'Edit ' + field,
            message: '<div><textarea class="col-sm-12" id="edit-'+field+'">'+currentValue+'</textarea><br/></div>',
            buttons:[
                {
                    label: 'Save',
                    action: function(dialogRef) {
                        //dialogRef.getModalBody().html('<p>' + url + ", " +  $('#edit-' + field).val() + ", " + $('body').attr('data-key') +"  </p>");
                        App.post({
			                url: url,
			                parameters: {key: $('body').attr('data-key'), field: field, data: $('#edit-' + field).val(), reload: false},
    		                success: function(message, node) {
                                window.location.reload();
			                },
			                error: function(message, node) {
                                window.location.reload();
    		                }
		                });
                        dialogRef.close();
                    }
                },
                {
                    label: 'Close',
                    action: function (dialogRef) {
                        dialogRef.close();
                    }
                }
            ]
        });
    });

    $('.edit-form-tags').on('click', function(e) {
        e.stopPropagation();
        var field = $(this).attr('data-field');
        var currentValue = $(this).attr('data-value');
        var url  = $("[data-edit-url]").attr('data-edit-url');
        var apiType = $(this).attr('data-type');
        BootstrapDialog.show({
            title: 'Edit ' + apiType,
            message:  '<input id="edit-' + field + '" type="text" class="col-lg-12 col-sm-12" value="'+currentValue+'" data-role="tagsinput"/>',
            onshown: function(dialogRef){
                var citynames = new Bloodhound({
                    datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
                    queryTokenizer: Bloodhound.tokenizers.whitespace,
                    prefetch: {
                        url: '/api/' + apiType,
                        filter: function(list) {
                        return $.map(list, function(cityname) {
                            return { name: cityname }; });
                        }
                    }
                });
                citynames.initialize();

                $('input').tagsinput({
                    typeaheadjs: {
                        name: 'citynames',
                        displayKey: 'name',
                        valueKey: 'name',
                        source: citynames.ttAdapter(),
                        templates: {
                            empty: '',
                            suggestion: Handlebars.compile('<p><strong>{{value}}</strong></p>')
                        }
                    }
                });
            },
            buttons:[
                {
                    label: 'Save',
                    action: function(dialogRef) {
                        App.post({
			                url: url,
			                parameters: {key: $('body').attr('data-key'), field: field, data: $('#edit-' + field).val(), type: 'array', reload: false},
    		                success: function(message, node) {
                                window.location.reload();
			                },
			                error: function(message, node) {
                                window.location.reload();
    		                }
		                });
                        dialogRef.close();
                    }
                },
                {
                    label: 'Close',
                    action: function (dialogRef) {
                        dialogRef.close();
                    }
                }
            ]
        });


    });

    $('.edit-boolean').on('click', function (e) {
        e.stopPropagation();
        var field = $(this).attr('data-field');
        var currentValue = ($(this).attr('data-value') == 'True')? 'checked': '';
        var url  = $("[data-edit-url]").attr('data-edit-url');
        BootstrapDialog.show({
            title: 'Edit ' + field,
            message: '<div>Check/Uncheck to change the state: <input class="col-sm-12" id="edit-'+field+'" type="checkbox" '+currentValue+'/><br/></div>',
            buttons:[
                {
                    label: 'Test',
                    action: function(dialogRef) {
                        console.log($('#edit-' + field).val());
                    }
                },
                {
                    label: 'Save',
                    action: function(dialogRef) {
                        App.post({
			                url: url,
			                parameters: {field: field, data: $('#edit-' + field).prop('checked'), type: 'boolean'},
    		                success: function(message, node) {
                                window.location.reload();
			                },
			                error: function(message, node) {
                                window.location.reload();
    		                }
		                });
                        dialogRef.close();
                    }
                },
                {
                    label: 'Close',
                    action: function (dialogRef) {
                        dialogRef.close();
                    }
                }
            ]
        });
    });

    $('body').on('change', 'input[type=file]', prepareUpload);
});;
