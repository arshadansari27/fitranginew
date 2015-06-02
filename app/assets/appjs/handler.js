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

    App.scroll_to_container = function(){
        console.log('Scrolling down');
        $('html, body').animate({
            scrollTop: $('#model-container-section').offset().top
        }, 1000);
    };

    var show_login_dialog = function() {
        window.location.href = '/login?target=' + window.location.href;
        /*
        window.$loginDialog = new BootstrapDialog({
            size: BootstrapDialog.SIZE_WIDE,
            title: "Sign in",
            message: $('<div></div>').load('/login-modal')
        });
        window.$loginDialog.realize();
        window.$loginDialog.open();
        */
    };
 var shorten_title = function(){
        var containers = '[data-type="model-container"][data-model="discussion"][data-card-type="row"]';
        var max_width = 0;
        $(containers).each(function(i, elem) {
            var w = $(elem).width();
            max_width = (w > max_width)? w: max_width;
        });
        max_width = parseInt(max_width);
        doc_width = 0.5 * parseInt($(document).width());
        console.log('[*] ' + max_width + ', ' + doc_width);


        $(".discussion-row-heading").each(function(i, elem){

            var title = "";
            if (max_width > doc_width || max_width == 0 || max_width == '0'){
                title = $(elem).attr('data-text-full');
            } else {
                title = $(elem).attr('data-text-short');
            }
            $(elem).html(title);
        });

    };

    App.show_login = function(){ show_login_dialog(); };

    $('body').on('click', '[data-action="check-login"]', function(e){
        e.preventDefault();
        e.stopPropagation();
        var user_id = $(this).attr('data-user-id');
        if (user_id == undefined || user_id.length == 0) {
            show_login_dialog();
        } else {
            window.location.href = '/community/my';
        }
        return false;
    });

    $(".show_login").click(function (e) {
        e.stopPropagation();
        show_login_dialog();
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

    $('body').on('click', '[data-action="delete-post"]', function(e){
        e.stopPropagation();
        if ($(this).attr('data-user-id') != undefined && $(this).attr('data-user-id').length > 0){
           var user_id = $(this).attr('data-user-id');
           var author_id = $(this).attr('data-author-id');
           var model_id = $(this).attr('data-model-id');
           if (user_id != author_id) {
                BootstrapDialog.alert('Cannot delete the post, since you are not the author of the post.');
                return;
           }
           App.post.delete(model_id, function(){ window.location.reload(); });
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
            if (data.status == 'success') {
                window.location.reload();
            }
        });
    });

    $('body').on('click', '[data-action="unpublish-article"]', function (e) {
        e.stopPropagation();
        e.preventDefault();
        App.content.unpublish($(this).attr('data-model-id'), 'article', function (data) {
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
        var that = $(this);
        var html = '';
        if (that.html().indexOf('Add to') > -1) {
            html = '<span class="fa fa-list yellow"></span>&nbsp;Wishlisted';
        } else {
            html = '<span class="fa fa-list yellow"></span>&nbsp;';
        }
        App.profile.add_adventure_to_wish_list(user, model, function(data){
            if(data.status == 'success') {
                that.html(html);
                that.attr('data-content', 'Remove from wishlist');
                that.attr('data-action', 'remove-adventure-wishlist');
            } else {
                $('.alert').html(data.message);
                $('.alert').show();
                setTimeout(function(){
                    $('.alert').hide()
                }, 3000);
            }
        });
    });
    $('body').on('click', '[data-action="remove-adventure-wishlist"]', function (e) {
        e.stopPropagation();
        e.preventDefault();
        var user = $(this).attr('data-user-id');
        var model = $(this).attr('data-model-id');
        var that = $(this);
        var html = '';
        if (that.html().indexOf('Wishlisted') > -1) {
            html = '<span class="fa fa-list grey"></span>&nbsp;Add to Wishlist';
        } else {
            html = '<span class="fa fa-list grey"></span>&nbsp;';
        }
        App.profile.remove_adventure_from_wish_list(user, model, function(data){
            if(data.status == 'success') {
                that.html(html);
                that.attr('data-content', 'Add to wishlist');
                that.attr('data-action', 'add-adventure-wishlist');
            } else {
                $('.alert').html(data.message);
                $('.alert').show();
                setTimeout(function(){
                    $('.alert').hide()
                }, 3000);
            }
        });
    });
    $('body').on('click', '[data-action="add-adventure-accomplished"]', function (e) {
        e.stopPropagation();
        e.preventDefault();
        var user = $(this).attr('data-user-id');
        var model = $(this).attr('data-model-id');
        var that = $(this);
        var html = '';
        if (that.html().indexOf('this') > -1) {
            html = '<span class="fa fa-flag green"></span>&nbsp;Undo this';
        } else {
            html = '<span class="fa fa-flag green"></span>&nbsp;';
        }
        App.profile.add_adventure_to_done(user, model, function(data){
            if(data.status == 'success') {
                that.html(html);
                that.attr('data-content', 'Undo this');
                that.attr('data-action', 'remove-adventure-accomplished');
            } else {
                $('.alert').html(data.message);
                $('.alert').show();
                setTimeout(function(){
                    $('.alert').hide()
                }, 3000);
            }
        });
    });
    $('body').on('click', '[data-action="remove-adventure-accomplished"]', function (e) {
        e.stopPropagation();
        e.preventDefault();
        var user = $(this).attr('data-user-id');

        var model = $(this).attr('data-model-id');
        var that = $(this);
        var html = '';
        if (that.html().indexOf('this') > -1) {
            html = '<span class="fa fa-flag grey"></span>&nbsp;Done this';
        } else {
            html = '<span class="fa fa-flag grey"></span>&nbsp;';
        }
        App.profile.remove_adventure_from_done(user, model, function(data){
            if(data.status == 'success') {
                that.html(html);
                that.attr('data-content', 'Done this');
                that.attr('data-action', 'add-adventure-accomplished');
            } else {
                $('.alert').html(data.message);
                $('.alert').show();
                setTimeout(function(){
                    $('.alert').hide()
                }, 3000);
            }
        });
    });
    $('body').on('click', '[data-action="add-activity-favorite"]', function (e) {
        e.stopPropagation();
        e.preventDefault();
        var user = $(this).attr('data-user-id');
        var model = $(this).attr('data-model-id');
        var that = $(this);
        var text_added = '';
        var text_add = '';
        if (that.html().indexOf('Specialization') > 0) {
            text_added = '<h3><i class="fa fa-check"></i>Added to Specialization</h3>';
            text_add = '<h3>Add to Specialization</h3>';
        } else {
            text_added = '<h3><i class="fa fa-check"></i>Added to Favorites</h3>';
            text_add = '<h3>Add to Favorites</h3>';
        }

        App.profile.add_activity_to_favorite(user, model, function(data){
            if(data.status == 'success') {
                that.html(text_added);
                that.attr('data-action', 'remove-activity-favorite');
            } else {
                $('.alert').html(data.message);
                $('.alert').show();
                setTimeout(function(){
                    $('.alert').hide()
                }, 3000);
            }
        });
    });
    $('body').on('click', '[data-action="remove-activity-favorite"]', function (e) {
        e.stopPropagation();
        e.preventDefault();
        var user = $(this).attr('data-user-id');
        var model = $(this).attr('data-model-id');
        var that = $(this);
        var text_added = '';
        var text_add = '';
        if (that.html().indexOf('Specialization') > 0) {
            text_added = '<h3><i class="fa fa-check"></i>Added to Specialization</h3>';
            text_add = '<h3>Add to Specialization</h3>';
        } else {
            text_added = '<h3><i class="fa fa-check"></i>Added to Favorites</h3>';
            text_add = '<h3>Add to Favorites</h3>';
        }
        App.profile.remove_activity_from_favorite(user, model, function(data){
            if(data.status == 'success') {
                that.attr('data-action', 'add-activity-favorite');
                that.html(text_add);
            } else {
                $('.alert').html(data.message);
                $('.alert').show();
                setTimeout(function(){
                    $('.alert').hide()
                }, 3000);
            }
        });
    });
    $('body').on('click', '[data-action="follow-profile"]', function (e) {

        e.stopPropagation();
        e.preventDefault();
        var user = $(this).attr('data-user-id');
        var model = $(this).attr('data-model-id');
        var that = $(this);
        App.profile.add_profile_to_follow(user, model, function(data){
            if(data.status == 'success') {
                that.attr('data-action', 'unfollow-profile');
                var html = '';
                if (that.html().indexOf('fa-plus') > -1) {
                    html = '<i class="fa fa-user fs-20 blue"></i><i class="fa fa-check blue"></i>';
                } else {
                    html = '<i class="fa fa-user blue"></i> Unfollow'
                }
                that.html(html);
            } else {
                $('.alert').html(data.message);
                $('.alert').show();
                setTimeout(function(){
                    $('.alert').hide()
                }, 3000);
            }
        });
    });
    $('body').on('click', '[data-action="unfollow-profile"]', function (e) {
        e.stopPropagation();
        e.preventDefault();
        var user = $(this).attr('data-user-id');
        var model = $(this).attr('data-model-id');
        var that = $(this);
        App.profile.remove_profile_from_follow(user, model, function(data){
            if(data.status == 'success') {
                var html = ''
                if (that.html().indexOf('fa-check') > -1) {
                    html = '<i class="fa fa-user fs-20 grey"></i><i class="fa fa-plus grey"></i>'
                } else {
                    html = '<i class="fa fa-user grey"></i> Follow';
                }
                that.html(html);
                that.attr('data-action', 'follow-profile');
            } else {
                $('.alert').html(data.message);
                $('.alert').show();
                setTimeout(function(){
                    $('.alert').hide()
                }, 3000);
            }
        });
    });
    $('body').on('click', '[data-action="add-trip-joined"]', function (e) {
        e.stopPropagation();
        e.preventDefault();
        var user = $(this).attr('data-user-id');
        var model = $(this).attr('data-model-id');
        App.profile.add_trip_to_join(user, model);
    });
    $('body').on('click', '[data-action="remove-trip-joined"]', function (e) {
        e.stopPropagation();
        e.preventDefault();
        var user = $(this).attr('data-user-id');
        var model = $(this).attr('data-model-id');
        App.profile.remove_trip_from_join(user, model);
    });
    $('body').on('click', '[data-action="add-trip-interested"]', function (e) {
        e.stopPropagation();
        e.preventDefault();
        var user = $(this).attr('data-user-id');
        var model = $(this).attr('data-model-id');
        App.profile.add_trip_to_interest(user, model);
    });
    $('body').on('click', '[data-action="remove-trip-interested"]', function (e) {
        e.stopPropagation();
        e.preventDefault();
        var user = $(this).attr('data-user-id');
        var model = $(this).attr('data-model-id');
        App.profile.remove_trip_from_interest(user, model);
    });

    $('body').on('click', '[data-action="send-enquiry"]', function(e){
        e.stopPropagation();
        e.preventDefault();
        var values = $('[data-action-value]');
        var name, email, phone, enquiry;
        var model = $(this).attr('data-model-id');
        console.log(values);
        console.log(model);
        if (values != undefined) {
            for(var i = 0; i < values.length; i++){
                var elem = values[i]
                var value = $(elem).attr('data-action-value');
                if (value == 'name') {
                    name = $(elem).val();
                } else if (value == 'email') {
                    email = $(elem).val();
                } else if (value == 'phone') {
                    phone = $(elem).val();
                } else if (value == 'enquiry') {
                    enquiry = $(elem).val();
                }
            }
            if ((name == undefined || name.length == 0) || (email == undefined || email.length == 0) ){
                BootstrapDialog.alert('Please enter your name and email. They are mandatory.');
            } else {
                App.profile.book_trip(name, email, phone, enquiry, model);
            }
        }

    });

    $('body').on('click', '[data-action="delete-discussion"]', function (e) {
        e.stopPropagation();
        e.preventDefault();
        var that = this;
        BootstrapDialog.confirm("Are you sure you want to delete", function (ip) {
            if (ip == true) {
                App.content.delete($(that).attr('data-model-id'), 'discussion', function (data) {
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


    $('body').on('click', '[data-action="delete-article"]', function (e) {
        e.stopPropagation();
        e.preventDefault();
        var that = this;
        BootstrapDialog.confirm("Are you sure you want to delete", function (ip) {
            if (ip == true) {
                App.content.delete($(that).attr('data-model-id'), 'article', function (data) {
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

    $('body').on('click', '[data-action="not-ok"]', function (e) {
        e.stopPropagation();
        e.preventDefault();
        var that = this;
        BootstrapDialog.confirm("Are you sure you want to report this?", function (ip) {
            if (ip == true) {
                var model_id = $(that).attr('data-model-id');
                var model_type = $(that).attr('data-model');
                var user_id = $(that).attr('data-user-id');
                console.log(Object.keys(App));
                console.log(Object.keys(App.editor));
                App.profile.report_not_ok(model_id, model_type, user_id, function (data) {
                    BootstrapDialog.alert(data.message);
                    if (data.status == 'success') {
                        window.location.reload();
                    }
                });
            }
        });
    });


    $('body').on('click', '[data-action="switch-profile"]', function (e) {
        e.stopPropagation();
        e.preventDefault();
        var that = $('[data-action="switch-profile"]');
        var profile = that.attr('data-model-id');
        var user = that.attr('data-user-id');
        console.log('[*] ' + user + ": " + profile);
        BootstrapDialog.confirm('Do you wish to switch the profile', function(val){
            console.log('Confirmation: ' + val);
            if (val== true) {
            if (profile != undefined && user != undefined) {
                console.log(profile + ", "+user);
                App.profile.switch_profile(user, profile, function(){
                    window.location.reload();
                });
            }
            }
        });

    });

    $('body').on('click', '[data-action="ask-to-login"]', function(e){
        e.stopPropagation();
        e.preventDefault();
        BootstrapDialog.show({
            message: '<div class="text-center"><h3>Please login!</h3><p>You must have personal account inorder to add your organization!</p></div>',
            buttons: [
                {
                    label: 'Close',
                    cssClass: 'btn-primary',
                    action: function(dialog) {
                        dialog.close();
                    }
                }
            ]
        });
    });

    $('body').on('click', '[data-action="save-profile"]', function (e) {
        e.stopPropagation();
        e.preventDefault();

        var id, name, phone, location, website, facebook, google_plus, linked_in, youtube_channel, blog_channel, location_lat, location_long, about;
        id              = $('#profile-id').val();
        logged_in        = $('#logged-in-id').val();
        name            = $('#name-edit').val();
        phone           = $('#phone-edit').val();
        location        = $('#geo_location_name').val();
        location_lat    = $('#geo_location_lat').val();
        location_long   = $('#geo_location_long').val();
        city            = $('#geo_city').val();
        region          = $('#geo_region').val();
        state           = $('#geo_state').val();
        country         = $('#geo_country').val();
        website         = $('#website-edit').val();
        facebook        = $('#facebook-edit').val();
        google_plus     = $('#google-plus-edit').val();
        linked_in       = $('#linked-in-edit').val();
        youtube_channel = $('#youtube-channel-edit').val();
        blog_channel    = $('#blog-channel-edit').val();
        about           = $('#about-edit').val();
        email           = $('#email-edit').val();
        type            = $('#type-edit').val();

        if (id == undefined || id.length == 0) {
            App.profile.register_complete_profile({
                    name: name,
                    email: email,
                    type: type,
                    phone: phone,
                    location: location,
                    location_lat: location_lat,
                    location_long: location_long,
                    website:website,
                    facebook: facebook,
                    google_plus: google_plus,
                    linked_in: linked_in,
                    youtube_channel: youtube_channel,
                    blog_channel: blog_channel,
                    about: about,
                    logged_in: logged_in,
                    city: city,
                    region: region,
                    state: state,
                    country: country
                }, function(data){
                    BootstrapDialog.alert({title: data.status, message: data.message});
                    setTimeout(0, function(){ window.location.href='/explore';})
                }
            );
        } else {
            App.profile.edit_profile(id, {
                name: name,
                phone: phone,
                location: location,
                location_lat: location_lat,
                location_long: location_long,
                website:website,
                facebook: facebook,
                google_plus: google_plus,
                linked_in: linked_in,
                youtube_channel: youtube_channel,
                blog_channel: blog_channel,
                about: about,
                city: city,
                region: region,
                state: state,
                country: country
            }, function(data){
                BootstrapDialog.alert({title: data.status, message: data.message});
            });
        }
    });


    $('body').on('click', '[data-action="edit-profile"]', function (e) {
        e.stopPropagation();
        e.preventDefault();
        window.location.href = '/edit-profile';
        if(true) return;
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
                        var id, name, phone, location, website, facebook, google_plus, linked_in, youtube_channel, blog_channel, location_lat, location_long, about;
                        id              = $('#profile-id').val();
                        name            = $('#name-edit').val();
                        phone           = $('#phone-edit').val();
                        location        = $('#geo_location_name').val();
                        location_lat    = $('#geo_location_lat').val();
                        location_long   = $('#geo_location_long').val();
                        website         = $('#website-edit').val();
                        facebook        = $('#facebook-edit').val();
                        google_plus     = $('#google-plus-edit').val();
                        linked_in       = $('#linked-in-edit').val();
                        youtube_channel = $('#youtube-channel-edit').val();
                        blog_channel    = $('#blog-channel-edit').val();
                        if ($('#about-edit') != undefined) {
                            about       = $('#about-edit').val();
                        } else {
                            about       = '';
                        }
                        App.profile.edit_profile(id, {
                            name: name,
                            phone: phone,
                            location: location,
                            location_lat: location_lat,
                            location_long: location_long,
                            website:website,
                            facebook: facebook,
                            google_plus: google_plus,
                            linked_in: linked_in,
                            youtube_channel: youtube_channel,
                            blog_channel: blog_channel,
                            about: about
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

    $('body').on('click', '[data-action="edit-cover-image"]', function (e) {
        e.stopPropagation();
        e.preventDefault();
        var model_id = $(this).attr('data-model-id');
        var model = $(this).attr('data-model');
        if (model == undefined || model.length == 0 || model_id == undefined || model_id.length == 0){
            BootstrapDialog.alert('Something went wrong, please try again after refreshing the page.');
            return;
        }
        BootstrapDialog.show({
            title: 'Upload cover image',
            message: $('<div></div>').load('/cover-image-modal'),
            icon: 'glyphicon glyphicon-send',
            autospin: true,
            buttons: [
                {
                    label: 'Close',
                    action: function(dialog) {
                        dialog.close();
                    }
                },
                {
                    label: 'Upload',
                    cssClass: 'btn-primary',
                    action: function(dialog){
                        $('.form-group').hide();
                        App.uploader(dialog);
                    }
                },
                {
                    label: 'Save',
                    cssClass: 'btn-primary',
                    action: function(dialog){
                        var url = $('.upload-image').val();
                        App.base_editor.save_image_cover(model, model_id, url);
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

    var clean_pasted_html = function(original) {
        u = document.createElement('div');
        u.innerHTML = original;
        return u.innerText;
    };

    var summernote_image_upload = function(file, editor, welEditable) {
            data = new FormData();
            data.append("file-0", file);
            jQuery.ajax({
                url: '/dialog/upload_image?permanent=True',
                data: data,
                cache: false,
                contentType: false,
                processData: false,
                type: 'POST',
                success: function(data){
                    editor.insertImage(welEditable, data.url);
                },
                error: function(data) {
                    BootstrapDialog.alert('Something went wrong when uploading the file.');
                }
            });
    };

    if ($('.summernote') != undefined) {
        //$('.summernote').summernote({height: 400});
        $('.summernote').each(function(){
            var $textArea = $(this);
            $textArea.summernote({
                height: 400,
                onImageUpload: function(files, editor, welEditable) {
                    summernote_image_upload(files[0], editor, welEditable);
                },
                onkeyup: function (e) {
                    var code = $(this).code();
                    $textArea.val(code);
                    $textArea.change(); //To update any action binded on the control
                },
                onpaste: function(e) {
                    var thisNote = $(this);
                    var updatePastedText = function(someNote){
                        var original = someNote.code();
                        var cleaned = clean_pasted_html(original); //this is where to call whatever clean function you want. I have mine in a different file, called CleanPastedHTML.
                        someNote.code('').html(cleaned); //this sets the displayed content editor to the cleaned pasted code.
                    };
                    setTimeout(function () {
                        //the function is called before the text is really pasted.
                        updatePastedText(thisNote);
                    }, 10);
                }
            });
        });
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

    $('.hoverable').popover({trigger: 'hover'});

    var query_from_filters = function(model, category) {
        var query = '';
        $('[data-filter][data-model="' + model + '"]').each(function(j, filter_element) {
            var filter_category     = $(filter_element).attr('data-category');
            var filter_key          = $(filter_element).attr('data-filter');
            var filter_type         = $(filter_element).attr('data-filter-type');

            var filter_value        = $(filter_element).val();

            if (filter_category != undefined && filter_category != category) {
                return;
            }
            if (filter_value == undefined || filter_value == null || filter_value.length == 0 || filter_value == '--') {
                return;
            }

            if (filter_type != undefined && filter_type.length > 0){
                filter_value = filter_type + '|' + filter_value;
            }

            query += filter_key+ ":"  + filter_value + ';';
        });

        return query;
    };

    var query_from_sorters = function(model, category) {
        var query = '';
        $('[data-sorter][data-model="' + model + '"]').each(function(j, sorter_element) {
            var sorter_category     = $(sorter_element).attr('data-category');
            var sorter_key          = $(sorter_element).attr('data-sorter');
            //var sorter_type         = $(sorter_element).attr('data-sorter-type');

            var sorter_value        = $(sorter_element).val();

            if (sorter_category != undefined && sorter_category != category) {
                return;
            }
            if (sorter_value == undefined || sorter_value == null || sorter_value.length == 0 || sorter_value == '--') {
                return;
            }
            /*
            if (sorter_type != undefined && sorter_type.length > 0){
                sorter_value = sorter_type + '|' + sorter_value;
            }
            */

            query += sorter_key+ ":"  + sorter_value+ ';';
        });
        console.log('[*] Sorter Query: ' + query);
        return query;
    };

    App.filter_to_query = query_from_filters;
    App.sorter_to_query = query_from_sorters;

    var load_model = function(options, callback) {
        var query       = options.query;
        var sort_query  = options.sort_query;
        var page        = options.page;
        var size        = options.size;

        var model       = options.model;
        var card_type   = options.card_type;
        var category    = options.category;

        var url = '/listings?model_view=' + model + '&card_type=' + card_type + '&page=' + page + '&query=' + query + '&size=' + size + '&category=' + category+'&sort=' + sort_query;
        console.log('[*] Loading models from URL: ' + url);
        $.ajax({
                url: url
        }).done(function (data) {
            if (data.status == 'success') {
                callback(data);
                shorten_title();
            } else {
                console.log('Nothing to load...');
            }
        });
    };


    var load_more = function(load_more_button) {
        var btn_load_more = $(load_more_button);
        var model       = btn_load_more.attr('data-model');
        var category    = btn_load_more.attr('data-category');
        var card_type   = btn_load_more.attr('data-card-type');

        var page        = parseInt(btn_load_more.next('input[data-type="page"]').val() || 1);
        var size        = 24;

        var query       = query_from_filters(model, category);
        var sort_query  = query_from_sorters(model, category);

        var options = {
            query: query,
            sort_query: sort_query,
            page: page,
            size: size,
            model: model,
            category: category,
            card_type: card_type
        };

        console.log('[*] Load more' + JSON.stringify(options));

        if (page == 1) {
            btn_load_more.next('input[data-type="page"]').val('1');
        }

        var container = $('[data-type="model-container"][data-model="' +  model + '"][data-card-type="' + card_type + '"][data-category="'+ category + '"]');

        load_model(options,function(data){
            container.append(data.html);
            if (data.last_page <= page)  {
                btn_load_more.hide();
            }
            btn_load_more.next('[data-type="page"]').val(page + 1);
            $('.hoverable').popover();

        });


    };

    var initiate_model_loading = function(elem) {
        var model       = $(elem).attr('data-model');
        var category    = $(elem).attr('data-category');
        var card_type   = $(elem).attr('data-card-type');

        var query = query_from_filters(model, category);
        var sort_query  = query_from_sorters(model, category);

        var page = 1;
        var $sizeContainer = $('[data-type="size"][data-model="'+model+'"][data-category="' + category + '"][data-card-type="' + card_type + '"]');
        var size = ($sizeContainer != undefined && $sizeContainer.length > 0)? $sizeContainer.val(): 24;
        var options = {
            query: query,
            sort_query: sort_query,
            page: page,
            size: size,
            model: model,
            category: category,
            card_type: card_type
        };
        var load_more = $('button[data-action="load-more"][data-model="' +  model + '"][data-card-type="' + card_type + '"][data-category="'+ category + '"]');
        load_model(options,function(data){
            $(elem).html(data.html);
            if (data.has_data == 1 || data.has_data == '1') {
                $('[data-model="'+ model +'"][data-category="'+category+'"].help-info ').hide();
            }
            if (data.last_page <= 1 && load_more != undefined)  {
                $(load_more).hide();
            }
            $(load_more).next().val(page + 1);
            $('.hoverable').popover();
        });
    };

    App.reset_models_listing = initiate_model_loading;

    var filterSearch = '[data-filter-submit="search"]';
    $('body').on('click', filterSearch, function(e) {
        e.stopPropagation();

        var model       = $(this).attr('data-model');
        var category    = $(this).attr('data-category');

        var without_category_selector = '[data-type="model-container"][data-model="' + model + '"]';
        var with_category_selector = '[data-type="model-container"][data-model="' + model + '"][data-category="' + category + '"]';
        var selector = null;
        if (category == undefined) {
            selector = without_category_selector;
        } else {
            selector = with_category_selector;
        }

        $(selector).each(function(i, elem){
            initiate_model_loading(elem);
        });
        App.scroll_to_container();
    });

    var resetSearch = '[data-filter-submit="reset"]';
    $('body').on('click', resetSearch, function(e) {
        var model       = $(this).attr('data-model');
        var category    = $(this).attr('data-category');

        var without_category_selector = '[data-filter][data-model="' + model + '"]';
        var with_category_selector = '[data-filter][data-model="' + model + '"][data-category="' + category + '"]';
        var selector = null;
        if (category == undefined) {
            selector = without_category_selector;
        } else {
            selector = with_category_selector;
        }
        $(selector).each(function(j, filter_element) {
            var is_fixed = $(filter_element).attr('data-filter-status');
            if (is_fixed != undefined && is_fixed=='fixed') {
                return;
            }
            $(filter_element).val('');
        });

        without_category_selector = '[data-sorter][data-model="' + model + '"]';
        with_category_selector = '[data-sorter][data-model="' + model + '"][data-category="' + category + '"]';
        selector = null;
        if (category == undefined) {
            selector = without_category_selector;
        } else {
            selector = with_category_selector;
        }
        $(selector).each(function(j, sorter_element) {
            var is_fixed = $(sorter_element).attr('data-sorter-status');
            if (is_fixed != undefined && is_fixed=='fixed') {
                return;
            }
            $(sorter_element).val('');
        });



        without_category_selector = '[data-type="model-container"][data-model="' + model + '"]';
        with_category_selector = '[data-type="model-container"][data-model="' + model + '"][data-category="' + category + '"]';
        selector = null;
        if (category == undefined) {
            selector = without_category_selector;
        } else {
            selector = with_category_selector;
        }

        $(selector).each(function(i, elem){
            initiate_model_loading(elem);
        });
    });

    App.force_reset_listing = function(model, category) {
        if (category == undefined) {
            category = 'all';
        }
        selector = '[data-type="model-container"][data-model="' + model + '"][data-category="' + category + '"]';

        $(selector).each(function(i, elem){
            initiate_model_loading(elem);
        });
    }

    $('body').on('click', 'button[data-action="load-more"]', function(e) {
        e.stopPropagation();
        load_more(e.target);
    });


    $('[data-type="model-container"]').each(function(i, elem){
        initiate_model_loading(elem);
    });

    $('.geo-complete').geocomplete({details: 'form'});

     /*
     if (window.location.href.indexOf('/my') != -1) {
        window.App.profile.reset_counter(null, 'public', window.App.profile.update_counter);
     }
     if (window.location.href.indexOf('/messaging') != -1) {
        window.App.profile.reset_counter(null, 'private', window.App.profile.update_counter);
     }
     */

    if ($('.owl-carousel') != undefined) {
        $('.owl-carousel').owlCarousel({
            loop: true,
            margin: 10,
            nav: false,
            autoplay: true,
            autoplayTimeout: 3000,
            autoplayHoverPause: true,
            responsiveClass: true,
            responsive: {
                0: {
                    items: 1,
                    nav: false,
                    loop: true,
                },
                767: {
                    items: 1,
                    nav: false,
                    loop: true,
                },
                1000: {
                    items: 2,
                    nav: true,
                    loop: true,
                }
            }
        });
    }

    if ($('.hoverable') != undefined ) {
        $('.hoverable').popover();
    }

    if ($('.alert') != undefined) {
        setTimeout(function () {
            $('.alert').hide();
        }, 10000);
    }
});
