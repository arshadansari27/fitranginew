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
                if (data.status=='error' && data.message == 'Please login before making requests'){
                    App.show_login();
                }
    		    if (callback != null){
                    callback(data);
                } else {
                    window.location.reload();
                }
    		},
    		contentType: "application/json",
    		dataType: 'json'
		});
	};

    App.filter = function(id) {
        var input = $('#'+id);
        var category = input.attr('data-category');
        if (category == null || category == undefined || category.length == 0) category = 'all';
        var model = input.attr('data-model');
        var filters = model + '-' + category;

        window.filters = window.filters || {};
        window.filters[filters] = window.filters[filters] || [];

        var filters_list = window.filters[filters];
        console.log('Adding filter for [' + model + '] [' + category + ']: ' + id);
        filters_list.push(id);

    };

    App.show_login = function() {

        window.$loginDialog = new BootstrapDialog({
            size: BootstrapDialog.SIZE_WIDE,
            title: "Sign in",
            message: $('<div></div>').load('/login-modal')
        });
        window.$loginDialog.realize();
        window.$loginDialog.open();

    };


    App.show_registration = function(){

        window.$signupDialog = new BootstrapDialog({
                title: "Registration",
                message: $('<div></div>').load('/registration-modal'),
                buttons: [
                    {
                        label: 'Register',
                        cssClass: 'btn-primary',
                        action: function (dialogItself) {
                            var name = $('#signup-name').val();
                            var email = $('#signup-email').val();
                            var password = $("#signup-password").val();
                            var confirm = $("#signup-confirm").val();
                            console.log("Registering with: " + name + ", " + email + ", " + password + ", " + confirm);
                            $.ajax({
                                type: 'POST',
                                url: '/register',
                                data: {
                                    name: name,
                                    email: email,
                                    password: password,
                                    confirm: confirm
                                }
                            }).done(function (msg) {
                                if (msg.status == 'success') {
                                    dialogItself.close();
                                    window.location.reload();
                                } else {
                                    $("#message").html(msg.message);
                                    $("#error").show();
                                }
                            });
                        }
                    },
                    {
                        label: 'Close',
                        action: function (dialogItself) {
                            dialogItself.close();
                        }
                    }
                ]
        });

        window.$signupDialog.realize();
        window.$signupDialog.open();
    }

	window.App = App;
});
