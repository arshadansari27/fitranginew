/**
 * Created by arshad on 14/04/15.
 */
jQuery(document).ready(function ($) {

    var App = window.App;

    var show_dialog_message = function(dialogRef, status, message) {

        var box = '<div class="alert alert-'+ ((status=='success')?status: 'danger') +' fade in">'
            + '<a class="close" data-dismiss="alert" href="#">&times;</a>'
            + '<p class="alert-message">' + message + '</p>'
            + '</div>';
        dialogRef.getModalBody().prepend(box);
        if (status == 'success') {
            setTimeout(function(){
                window.location.reload();
            }, 1000);
        }
    };

    $(".show_login").click(function (e) {
        e.stopPropagation();
        window.$loginDialog = new BootstrapDialog({
            size: BootstrapDialog.SIZE_WIDE,
            title: "Sign in",
            message: $('<div></div>').load('/login-modal')
        });
        window.$loginDialog.realize();
        window.$loginDialog.open();
    });

    $(".show_signup").click(function (e) {
        e.stopPropagation();
        window.$signupDialog = new BootstrapDialog({
                title: "Registration",
                message: $('<div></div>').load('/registration-modal'),
                buttons: [
                    {
                        label: 'Register',
                        cssClass: 'btn-primary',
                        action: function (dialog) {
                            var name = $('#signup-name').val();
                            var email = $('#signup-email').val();
                            var password = $("#signup-password").val();
                            var confirm = $("#signup-confirm").val();
                            console.log("Registering with: " + name + ", " + email + ", " + password + ", " + confirm);
                            if (name == undefined || name.length == 0 || email == undefined || email.length == 0 || password == undefined || password.length < 4) {
                                show_dialog_message(dialog, 'error', 'Enter correct data');
                                return;
                            }
                            if (password != confirm) {
                                show_dialog_message(dialog, 'error', 'Passwords do no match');
                                return;
                            }
                            App.profile.register_profile(name, email, password, function(data){
                                show_dialog_message(dialog, data.status, data.message);
                                if (data.status == 'success') {
                                    setTimeout(function(){dialog.close();}, 1000);
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
    });


    var filterSearch = '[data-filter-submit="search"]';
    $('body').on('click', filterSearch, function (e) {
        e.stopPropagation();
        if (App.doFilter != undefined && App.doFilter.length != undefined) {
            for (var i = 0; i < App.doFilter.length; i++) {
                App.doFilter[i]();
            }
        }
    });

   var resetSearch = '[data-filter-submit="reset"]';
   $(resetSearch).on('click', function(e){
        e.stopPropagation();
        for(k in App.resetFilter) {
            App.resetFilter[k]();
        }
   });

    $('body').on('click', '[data-action="add-discussion"]', function (e) {
        e.stopPropagation();
        if ($(this).attr('data-user-id').length > 0) {
            window.location.href = "/write/discussion";
        } else {
            App.show_login();
        }
    });
    $('body').on('click', '[data-action="add-article"]', function (e) {
        e.stopPropagation();
        if ($(this).attr('data-user-id').length > 0) {
            window.location.href = "/write/article";
        } else {
            App.show_login();
        }
    });
    $('body').on('click', '[data-action="edit-discussion"]', function (e) {
        e.stopPropagation();
        if ($(this).attr('data-user-id').length > 0) {
            window.location.href = "/write/discussion/" + $(this).attr('data-model-id');
        } else {
            App.show_login();
        }
    });
    $('body').on('click', '[data-action="edit-article"]', function (e) {
        e.stopPropagation();
        if ($(this).attr('data-user-id').length > 0) {
            window.location.href = "/write/article/" + $(this).attr('data-model-id');
        } else {
            App.show_login();
        }
    });
    $('body').on('click', '[data-action="publish-article"]', function (e) {
        e.stopPropagation();
        e.preventDefault();
        App.content.publish($(this).attr('data-model-id'), 'article', function (data) {
            BootstrapDialog.alert(data.message);
            if (data.status == 'success') {
                window.location.reload();
            }
        });
    });

    $('body').on('click', '[data-action="unpublish-article"]', function (e) {
        e.stopPropagation();
        e.preventDefault();
        App.content.unpublish($(this).attr('data-model-id'), 'article', function (data) {
            BootstrapDialog.alert(data.message);
            if (data.status == 'success') {
                window.location.reload();
            }
        });
    });


    $('body').on('click', '[data-action="add-adventure-wishlist"]', function (e) {
        e.stopPropagation();
        e.preventDefault();
        var user = $(this).attr('data-user-id');
        var model = $(this).attr('data-model-id');
        App.profile.add_adventure_to_wish_list(user, model);
    });
    $('body').on('click', '[data-action="remove-adventure-wishlist"]', function (e) {
        e.stopPropagation();
        e.preventDefault();
        var user = $(this).attr('data-user-id');
        var model = $(this).attr('data-model-id');
        App.profile.remove_adventure_from_wish_list(user, model);
    });
    $('body').on('click', '[data-action="add-adventure-accomplished"]', function (e) {
        e.stopPropagation();
        e.preventDefault();
        var user = $(this).attr('data-user-id');
        var model = $(this).attr('data-model-id');
        App.profile.add_adventure_to_done(user, model);
    });
    $('body').on('click', '[data-action="remove-adventure-accomplished"]', function (e) {
        e.stopPropagation();
        e.preventDefault();
        var user = $(this).attr('data-user-id');
        var model = $(this).attr('data-model-id');
        App.profile.remove_adventure_from_done(user, model);
    });
    $('body').on('click', '[data-action="add-activity-favorite"]', function (e) {
        e.stopPropagation();
        e.preventDefault();
        var user = $(this).attr('data-user-id');
        var model = $(this).attr('data-model-id');
        App.profile.add_activity_to_favorite(user, model);
    });
    $('body').on('click', '[data-action="remove-activity-favorite"]', function (e) {
        e.stopPropagation();
        e.preventDefault();
        var user = $(this).attr('data-user-id');
        var model = $(this).attr('data-model-id');
        App.profile.remove_activity_from_favorite(user, model);
    });
    $('body').on('click', '[data-action="follow-profile"]', function (e) {

        e.stopPropagation();
        e.preventDefault();
        var user = $(this).attr('data-user-id');
        var model = $(this).attr('data-model-id');
        App.profile.add_profile_to_follow(user, model);
    });
    $('body').on('click', '[data-action="unfollow-profile"]', function (e) {
        e.stopPropagation();
        e.preventDefault();
        var user = $(this).attr('data-user-id');
        var model = $(this).attr('data-model-id');
        App.profile.remove_profile_from_follow(user, model);
    });

    $('body').on('click', '[data-action="delete-article"]', function (e) {
        e.stopPropagation();
        e.preventDefault();
        BootstrapDialog.confirm("Are you sure you want to delete", function (ip) {
            if (ip == true) {
                App.content.delete($(this).attr('data-model-id'), 'article', function (data) {
                    BootstrapDialog.alert(data.message);
                    if (data.status == 'success') {
                        if (window.location.href.search('write/') == 0) {
                            window.history.back();
                        } else {
                            window.location.reload();
                        }
                    }
                });
            }
        });
    });

    $('body').on('click', '[data-action="edit-profile"]', function (e) {
        e.stopPropagation();
        e.preventDefault();

        BootstrapDialog.show({
            title: 'Edit Profile',
            message: $('<div></div>').load('/edit-profile-modal'),
            buttons: [
                {
                    label: 'Close',
                    action: function(dialog) {
                        dialog.close();
                    }
                },
                {
                    label: 'Save',
                    cssClass: 'btn-primary',
                    action: function(dialog){
                        dialog.getModalBody().find('.alert').remove();
                        var id, name, phone, location, website, facebook, google_plus, linked_in, youtube_channel, blog_channel;
                        id              = $('#profile-id').val();
                        name            = $('#name-edit').val();
                        phone           = $('#phone-edit').val();
                        location        = $('#location-edit').val();
                        website         = $('#website-edit').val();
                        facebook        = $('#facebook-edit').val();
                        google_plus     = $('#google-plus-edit').val();
                        linked_in       = $('#linked-in-edit').val();
                        youtube_channel = $('#youtube-channel-edit').val();
                        blog_channel    = $('#blog-channel-edit').val();
                        App.profile.edit_profile(id, {
                            name: name,
                            phone: phone,
                            location: location,
                            website:website,
                            facebook: facebook,
                            google_plus: google_plus,
                            linked_in: linked_in,
                            youtube_channel: youtube_channel,
                            blog_channel: blog_channel
                        }, function(data){
                            show_dialog_message(dialog, data.status, data.message);
                            if (data.status == 'success') {
                                setTimeout(function(){dialog.close();}, 1000);
                            }
                        });
                    }
                }
            ]
        });
    });

    $('body').on('click', '[data-action="edit-profile-preferences"]', function (e) {
        e.stopPropagation();
        e.preventDefault();

        BootstrapDialog.show({
            title: 'Edit Profile Preferences',
            message: $('<div></div>').load('/edit-profile-preferences-modal'),
            buttons: [
                {
                    label: 'Close',
                    action: function(dialog) {
                        dialog.close();
                    }
                },
                {
                    label: 'Save',
                    cssClass: 'btn-primary',
                    action: function(dialog){
                        dialog.getModalBody().find('.alert').remove();
                        var id, email_enabled, email_frequency;
                        id              = $('#profile-id').val();
                        email_enabled   = ($('#email-enabled-edit').is(':checked'))?true: false;
                        email_frequency = $('#email-frequency-edit').val();
                        console.log('[*] email enabled ' + email_enabled);
                        App.profile.edit_profile_preference(id, {
                            email_enabled: email_enabled,
                            email_frequency: email_frequency
                        }, function(data){
                            show_dialog_message(dialog, data.status, data.message);
                            if (data.status == 'success') {
                                setTimeout(function(){dialog.close();}, 1000);
                            }
                        });
                    }
                }
            ]
        });
    });

    $('body').on('click', '[data-action="edit-profile-password"]', function (e) {
        e.stopPropagation();
        e.preventDefault();

        BootstrapDialog.show({
            title: 'Change Password',
            message: $('<div></div>').load('/change-password-modal'),
            buttons: [
                {
                    label: 'Close',
                    action: function(dialog) {
                        dialog.close();
                    }
                },
                {
                    label: 'Save',
                    cssClass: 'btn-primary',
                    action: function(dialog){

                        dialog.getModalBody().find('.alert').remove();
                        var id, old_passwd, new_passwd, confirm_passwd;
                        id              = $('#profile-id').val();
                        old_passwd      = $('#old-edit').val();
                        new_passwd      = $('#new-edit').val();
                        confirm_passwd  = $('#confirm-edit').val();
                        if (old_passwd == undefined || old_passwd.length == 0) {
                            show_dialog_message(dialog, 'error', 'Enter correct password');
                            return;
                        }
                        if (new_passwd == undefined || new_passwd.length < 4) {
                            show_dialog_message(dialog, 'error', 'Password must atleast be 4 characters');
                            return;
                        }
                        if (new_passwd != confirm_passwd) {
                            show_dialog_message(dialog, 'error', 'Passwords do no match');
                            return;
                        }
                        App.profile.change_password(id, old_passwd, new_passwd, function(data){
                            show_dialog_message(dialog, data.status, data.message);
                            if (data.status == 'success') {
                                setTimeout(function(){dialog.close();}, 1000);
                            }
                        });
                    }
                }
            ]
        });
    });

    $('.show_subscribe').click(function () {
        subscription_modal_text = '<div><div id="subscribe-form"><input type="text" id="subscription-name" class="form-control" placeholder="Name" required="Please Enter Your Name"><br/><input type="email" id="subscription-email" class="form-control" placeholder="email" required="Please Enter Your Email">' + '</div>' + '<div id="subscribe-message"></div>' + '</div>';
        console.log(subscription_modal_text);
        BootstrapDialog.show({
            title: 'Subscribe For Latest Fitrangi Updates!',
            message: subscription_modal_text,
            buttons: [
                {
                    label: 'Close',
                    action: function (dialogRef) {
                        dialogRef.close()
                    }
                },
                {
                    label: 'Subscribe',
                    cssClass: 'btn-primary',
                    action: function (dialogRef) {
                        var subscription_name = $('#subscription-name').val();
                        var subscription_email = $('#subscription-email').val();
                        console.log('Subscribing: ' + subscription_name + ", " + subscription_email);
                        App.profile.subscribe(subscription_name, subscription_email, function(data){
                            $('#subscribe-message').html(data.message);
                            $('#subscribe-message').addClass('alert');
                            if (msg.status == 'success') {
                                $('#subscribe-form').hide();
                                $('#subscribe-message').addClass('alert-success');
                                $('#subscribe-message').show();

                            } else {
                                $('#subscribe-message').addClass('alert-error');
                                $('#subscribe-message').show();
                            }
                        });
                    }
                }
            ]
        });
    });

    if ($('.summernote') != undefined) {
        $('.summernote').summernote({height: 400});
    }
    function postToFeed(title, desc, url, image) {
        var obj = {method: 'feed', link: 'http://www.fitrangi.com' + url, picture: 'http://www.fitrangi.com/' + image, name: title, description: desc};

        function callback(response) {
        }

        FB.ui(obj, callback);
    }

    $('.btnFbShare').click(function (e) {
        e.stopPropagation();
        e.preventDefault();
        elem = $(this);
        postToFeed(elem.data('title'), elem.data('desc'), elem.data('href'), elem.data('image'));
        return false;
    });

    var App = window.App;
    if (window.App.doFilter != undefined && window.App.doFilter.length != undefined) {
        for (var i = 0; i < window.App.doFilter.length; i++) {
            window.App.doFilter[i]();
        }
    }
});
