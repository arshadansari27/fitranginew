jQuery(document).ready(function ($) {
    var App = window.App;
    var show_dialog_message = function (dialogRef, status, message) {
        var box = '<div class="alert alert-' + ((status == 'success') ? status : 'danger') + ' fade in">'
            + '<a class="close" data-dismiss="alert" href="#">&times;</a>'
            + '<p class="alert-message">' + message + '</p>'
            + '</div>';
        dialogRef.getModalBody().prepend(box);
        if (status == 'success') {
            setTimeout(function () {
                window.location.reload();
            }, 1000);
        }
    };
    var show_login_dialog = function () {
        window.location.href = '/login?target=' + window.location.href;
    };
    App.show_login = function () {
        show_login_dialog();
    };
    $('body').on('click', '[data-action="check-login"]', function (e) {
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
        window.$signupDialog = new BootstrapDialog({title: "Registration", message: $('<div></div>').load('/registration-modal'), buttons: [
            {label: 'Register', cssClass: 'btn-primary', action: function (dialog) {
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
                App.profile.register_profile(name, email, password, function (data) {
                    show_dialog_message(dialog, data.status, data.message);
                    if (data.status == 'success') {
                        setTimeout(function () {
                            dialog.close();
                        }, 1000);
                    }
                });
            }},
            {label: 'Close', action: function (dialogItself) {
                dialogItself.close();
            }}
        ]});
        window.$signupDialog.realize();
        window.$signupDialog.open();
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
    $('body').on('click', '[data-action="send-enquiry"]', function (e) {
        e.stopPropagation();
        e.preventDefault();
        var values = $('[data-action-value]');
        var name, email, phone, enquiry;
        var model = $(this).attr('data-model-id');
        console.log(values);
        console.log(model);
        if (values != undefined) {
            for (var i = 0; i < values.length; i++) {
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
            if ((name == undefined || name.length == 0) || (email == undefined || email.length == 0)) {
                BootstrapDialog.alert('Please enter your name and email. They are mandatory.');
            } else {
                App.profile.book_trip(name, email, phone, enquiry, model);
            }
        }
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
    $('body').on('click', '[data-action="switch-profile"]', function (e) {
        e.stopPropagation();
        e.preventDefault();
        var that = $(e.target);
        var profile = that.attr('data-model-id');
        var user = that.attr('data-user-id');
        console.log('[*] ' + user + ": " + profile);
        BootstrapDialog.confirm('Do you wish to switch the profile', function (val) {
            console.log('Confirmation: ' + val);
            if (val == true) {
                if (profile != undefined && user != undefined) {
                    console.log(profile + ", " + user);
                    App.profile.switch_profile(user, profile, function () {
                        window.location.reload();
                    });
                }
            }
        });
    });
    $('body').on('click', '[data-action="ask-to-login"]', function (e) {
        e.stopPropagation();
        e.preventDefault();
        BootstrapDialog.show({message: '<div class="text-center"><h3>Please login!</h3><p>You must have personal account inorder to add your organization!</p></div>', buttons: [
            {label: 'Close', cssClass: 'btn-primary', action: function (dialog) {
                dialog.close();
            }}
        ]});
    });
    $('body').on('click', '[data-action="save-profile"]', function (e) {
        e.stopPropagation();
        e.preventDefault();
        var id, name, phone, location, website, facebook, google_plus, linked_in, youtube_channel, blog_channel, location_lat, location_long, about;
        id = $('#profile-id').val();
        logged_in = $('#logged-in-id').val();
        name = $('#name-edit').val();
        phone = $('#phone-edit').val();
        location = $('#geo_location_name').val();
        location_lat = $('#geo_location_lat').val();
        location_long = $('#geo_location_long').val();
        website = $('#website-edit').val();
        facebook = $('#facebook-edit').val();
        google_plus = $('#google-plus-edit').val();
        linked_in = $('#linked-in-edit').val();
        youtube_channel = $('#youtube-channel-edit').val();
        blog_channel = $('#blog-channel-edit').val();
        about = $('#about-edit').val();
        email = $('#email-edit').val();
        type = $('#type-edit').val();
        if (id == undefined || id.length == 0) {
            App.profile.register_complete_profile({name: name, email: email, type: type, phone: phone, location: location, location_lat: location_lat, location_long: location_long, website: website, facebook: facebook, google_plus: google_plus, linked_in: linked_in, youtube_channel: youtube_channel, blog_channel: blog_channel, about: about, logged_in: logged_in}, function (data) {
                BootstrapDialog.alert({title: data.status, message: data.message});
                setTimeout(0, function () {
                    window.location.href = '/explore';
                })
            });
        } else {
            App.profile.edit_profile(id, {name: name, phone: phone, location: location, location_lat: location_lat, location_long: location_long, website: website, facebook: facebook, google_plus: google_plus, linked_in: linked_in, youtube_channel: youtube_channel, blog_channel: blog_channel, about: about}, function (data) {
                BootstrapDialog.alert({title: data.status, message: data.message});
            });
        }
    });
    $('body').on('click', '[data-action="edit-profile"]', function (e) {
        e.stopPropagation();
        e.preventDefault();
        window.location.href = '/edit-profile';
        if (true)return;
        BootstrapDialog.show({title: 'Edit Profile', message: $('<div></div>').load('/edit-profile-modal'), buttons: [
            {label: 'Close', action: function (dialog) {
                dialog.close();
            }},
            {label: 'Save', cssClass: 'btn-primary', action: function (dialog) {
                dialog.getModalBody().find('.alert').remove();
                var id, name, phone, location, website, facebook, google_plus, linked_in, youtube_channel, blog_channel, location_lat, location_long, about;
                id = $('#profile-id').val();
                name = $('#name-edit').val();
                phone = $('#phone-edit').val();
                location = $('#geo_location_name').val();
                location_lat = $('#geo_location_lat').val();
                location_long = $('#geo_location_long').val();
                website = $('#website-edit').val();
                facebook = $('#facebook-edit').val();
                google_plus = $('#google-plus-edit').val();
                linked_in = $('#linked-in-edit').val();
                youtube_channel = $('#youtube-channel-edit').val();
                blog_channel = $('#blog-channel-edit').val();
                if ($('#about-edit') != undefined) {
                    about = $('#about-edit').val();
                } else {
                    about = '';
                }
                App.profile.edit_profile(id, {name: name, phone: phone, location: location, location_lat: location_lat, location_long: location_long, website: website, facebook: facebook, google_plus: google_plus, linked_in: linked_in, youtube_channel: youtube_channel, blog_channel: blog_channel, about: about}, function (data) {
                    show_dialog_message(dialog, data.status, data.message);
                    if (data.status == 'success') {
                        setTimeout(function () {
                            dialog.close();
                        }, 1000);
                    }
                });
            }}
        ]});
    });
    $('body').on('click', '[data-action="edit-profile-preferences"]', function (e) {
        e.stopPropagation();
        e.preventDefault();
        BootstrapDialog.show({title: 'Edit Profile Preferences', message: $('<div></div>').load('/edit-profile-preferences-modal'), buttons: [
            {label: 'Close', action: function (dialog) {
                dialog.close();
            }},
            {label: 'Save', cssClass: 'btn-primary', action: function (dialog) {
                dialog.getModalBody().find('.alert').remove();
                var id, email_enabled, email_frequency;
                id = $('#profile-id').val();
                email_enabled = ($('#email-enabled-edit').is(':checked')) ? true : false;
                email_frequency = $('#email-frequency-edit').val();
                console.log('[*] email enabled ' + email_enabled);
                App.profile.edit_profile_preference(id, {email_enabled: email_enabled, email_frequency: email_frequency}, function (data) {
                    show_dialog_message(dialog, data.status, data.message);
                    if (data.status == 'success') {
                        setTimeout(function () {
                            dialog.close();
                        }, 1000);
                    }
                });
            }}
        ]});
    });
    $('body').on('click', '[data-action="edit-profile-password"]', function (e) {
        e.stopPropagation();
        e.preventDefault();
        BootstrapDialog.show({title: 'Change Password', message: $('<div></div>').load('/change-password-modal'), buttons: [
            {label: 'Close', action: function (dialog) {
                dialog.close();
            }},
            {label: 'Save', cssClass: 'btn-primary', action: function (dialog) {
                dialog.getModalBody().find('.alert').remove();
                var id, old_passwd, new_passwd, confirm_passwd;
                id = $('#profile-id').val();
                old_passwd = $('#old-edit').val();
                new_passwd = $('#new-edit').val();
                confirm_passwd = $('#confirm-edit').val();
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
                App.profile.change_password(id, old_passwd, new_passwd, function (data) {
                    show_dialog_message(dialog, data.status, data.message);
                    if (data.status == 'success') {
                        setTimeout(function () {
                            dialog.close();
                        }, 1000);
                    }
                });
            }}
        ]});
    });
    $('body').on('click', '[data-action="edit-cover-image"]', function (e) {
        e.stopPropagation();
        e.preventDefault();
        var model_id = $(this).attr('data-model-id');
        var model = $(this).attr('data-model');
        if (model == undefined || model.length == 0 || model_id == undefined || model_id.length == 0) {
            BootstrapDialog.alert('Something went wrong, please try again after refreshing the page.');
            return;
        }
        BootstrapDialog.show({title: 'Upload cover image', message: $('<div></div>').load('/cover-image-modal'), icon: 'glyphicon glyphicon-send', autospin: true, buttons: [
            {label: 'Close', action: function (dialog) {
                dialog.close();
            }},
            {label: 'Upload', cssClass: 'btn-primary', action: function (dialog) {
                $('.form-group').hide();
                App.uploader(dialog);
            }},
            {label: 'Save', cssClass: 'btn-primary', action: function (dialog) {
                var url = $('.upload-image').val();
                App.base_editor.save_image_cover(model, model_id, url);
            }}
        ]});
    });
    $('.show_subscribe').click(function () {
        subscription_modal_text = '<div><div id="subscribe-form"><input type="text" id="subscription-name" class="form-control" placeholder="Name" required="Please Enter Your Name"><br/><input type="email" id="subscription-email" class="form-control" placeholder="email" required="Please Enter Your Email">' + '</div>' + '<div id="subscribe-message"></div>' + '</div>';
        console.log(subscription_modal_text);
        BootstrapDialog.show({title: 'Subscribe For Latest Fitrangi Updates!', message: subscription_modal_text, buttons: [
            {label: 'Close', action: function (dialogRef) {
                dialogRef.close()
            }},
            {label: 'Subscribe', cssClass: 'btn-primary', action: function (dialogRef) {
                var subscription_name = $('#subscription-name').val();
                var subscription_email = $('#subscription-email').val();
                console.log('Subscribing: ' + subscription_name + ", " + subscription_email);
                App.profile.subscribe(subscription_name, subscription_email, function (data) {
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
            }}
        ]});
    });
    if ($('.summernote') != undefined) {
        $('.summernote').each(function () {
            var $textArea = $(this);
            $textArea.summernote({height: 400, onkeyup: function (e) {
                $textArea.val($(this).code());
                $textArea.change();
            }});
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
    var query_from_filters = function (model, category) {
        var query = '';
        $('[data-filter][data-model="' + model + '"]').each(function (j, filter_element) {
            var filter_category = $(filter_element).attr('data-category');
            var filter_key = $(filter_element).attr('data-filter');
            var filter_type = $(filter_element).attr('data-filter-type');
            var filter_value = $(filter_element).val();
            if (filter_category != undefined && filter_category != category) {
                return;
            }
            if (filter_value == undefined || filter_value == null || filter_value.length == 0 || filter_value == '--') {
                return;
            }
            if (filter_type != undefined && filter_type.length > 0) {
                filter_value = filter_type + '|' + filter_value;
            }
            query += filter_key + ":" + filter_value + ';';
        });
        return query;
    };
    App.fitler_to_query = query_from_filters;
    var load_model = function (options, callback) {
        var query = options.query;
        var page = options.page;
        var size = options.size;
        var model = options.model;
        var card_type = options.card_type;
        var category = options.category;
        var url = '/listings?model_view=' + model + '&card_type=' + card_type + '&page=' + page + '&query=' + query + '&size=' + size + '&category=' + category;
        console.log('[*] Loading models from URL: ' + url);
        $.ajax({url: url}).done(function (data) {
            if (data.status == 'success') {
                callback(data);
            } else {
                console.log('Nothing to load...');
            }
        });
    };
    var load_more = function (load_more_button) {
        var btn_load_more = $(load_more_button);
        var model = btn_load_more.attr('data-model');
        var category = btn_load_more.attr('data-category');
        var card_type = btn_load_more.attr('data-card-type');
        var page = parseInt(btn_load_more.next('input[data-type="page"]').val() || 1);
        var size = 24;
        var query = query_from_filters(model, category);
        var options = {query: query, page: page, size: size, model: model, category: category, card_type: card_type};
        console.log('[*] Load more' + JSON.stringify(options));
        if (page == 1) {
            btn_load_more.next('input[data-type="page"]').val('1');
        }
        var container = $('[data-type="model-container"][data-model="' + model + '"][data-card-type="' + card_type + '"][data-category="' + category + '"]');
        load_model(options, function (data) {
            container.append(data.html);
            if (data.last_page <= page) {
                btn_load_more.hide();
            }
            btn_load_more.next('[data-type="page"]').val(page + 1);
        });
    };
    var initiate_model_loading = function (elem) {
        var model = $(elem).attr('data-model');
        var category = $(elem).attr('data-category');
        var card_type = $(elem).attr('data-card-type');
        var query = query_from_filters(model, category);
        var page = 1;
        var $sizeContainer = $('[data-type="size"][data-model="' + model + '"][data-category="' + category + '"][data-card-type="' + card_type + '"]');
        var size = ($sizeContainer != undefined && $sizeContainer.length > 0) ? $sizeContainer.val() : 24;
        var options = {query: query, page: page, size: size, model: model, category: category, card_type: card_type};
        console.log('[*]' + JSON.stringify(options));
        var load_more = $('button[data-action="load-more"][data-model="' + model + '"][data-card-type="' + card_type + '"][data-category="' + category + '"]');
        load_model(options, function (data) {
            $(elem).html(data.html);
            if (data.last_page <= 1 && load_more != undefined) {
                $(load_more).hide();
            }
            $(load_more).next().val(page + 1);
        });
    };
    App.reset_models_listing = initiate_model_loading;
    var filterSearch = '[data-filter-submit="search"]';
    $('body').on('click', filterSearch, function (e) {
        e.stopPropagation();
        var model = $(this).attr('data-model');
        var category = $(this).attr('data-category');
        var without_category_selector = '[data-type="model-container"][data-model="' + model + '"]';
        var with_category_selector = '[data-type="model-container"][data-model="' + model + '"][data-category="' + category + '"]';
        var selector = null;
        if (category == undefined) {
            selector = without_category_selector;
        } else {
            selector = with_category_selector;
        }
        $(selector).each(function (i, elem) {
            initiate_model_loading(elem);
        });
    });
    var resetSearch = '[data-filter-submit="reset"]';
    $('body').on('click', resetSearch, function (e) {
        var model = $(this).attr('data-model');
        var category = $(this).attr('data-category');
        var without_category_selector = '[data-filter][data-model="' + model + '"]';
        var with_category_selector = '[data-filter][data-model="' + model + '"][data-category="' + category + '"]';
        var selector = null;
        if (category == undefined) {
            selector = without_category_selector;
        } else {
            selector = with_category_selector;
        }
        $(selector).each(function (j, filter_element) {
            var is_fixed = $(filter_element).attr('data-filter-status');
            if (is_fixed != undefined && is_fixed == 'fixed') {
                return;
            }
            $(filter_element).val('');
        });
        without_category_selector = '[data-type="model-container"][data-model="' + model + '"]';
        with_category_selector = '[data-type="model-container"][data-model="' + model + '"][data-category="' + category + '"]';
        selector = null;
        if (category == undefined) {
            selector = without_category_selector;
        } else {
            selector = with_category_selector;
        }
        $(selector).each(function (i, elem) {
            initiate_model_loading(elem);
        });
    });
    App.force_reset_listing = function (model, category) {
        if (category == undefined) {
            category = 'all';
        }
        selector = '[data-type="model-container"][data-model="' + model + '"][data-category="' + category + '"]';
        $(selector).each(function (i, elem) {
            initiate_model_loading(elem);
        });
    }
    $('body').on('click', 'button[data-action="load-more"]', function (e) {
        e.stopPropagation();
        load_more(e.target);
    });
    $('[data-type="model-container"]').each(function (i, elem) {
        initiate_model_loading(elem);
    });
    $(".geo-complete").geocomplete().bind("geocode:result", function (event, result) {
        console.log("Result: " + JSON.stringify(result));
        var name = result.formatted_address;
        var lat = result.geometry.location.lat || result.geometry.location.A;
        var lon = result.geometry.location.lng || result.geometry.location.F;
        console.log(name + ', ' + lat + ', ' + lon);
        $('[data-type="geo-complete"]').val(name + "|" + lat + '|' + lon);
    });
});
$(document).ready(function () {
    var attr = $('body').attr('data-logged-in-as');
    var logged_in_user = attr;
    var reset_users_messages = function () {
        window.App.messaging = window.App.messaging || {};
        window.App.messaging.message_list = {};
        window.App.messaging.user_list = {};
    };
    var connect_async = function (user) {
        var wsuri;
        if (document.location.origin == "file://") {
            wsuri = "ws://127.0.0.1:8080/ws";
        } else {
            var loc = null;
            if (document.location.host.indexOf(':4500') != -1) {
                loc = document.location.host.replace(':4500', ':8080');
            } else if (document.location.host.indexOf(':8080') != -1) {
                loc = document.location.host;
            } else {
                loc = document.location.host + ":8080";
            }
            wsuri = (document.location.protocol === "http:" ? "ws:" : "wss:") + "//" +
                loc + "/ws";
        }
        var connection = new autobahn.Connection({url: wsuri, realm: "realm1"});
        var notification_timer;
        connection.onopen = function (session, details) {
            console.log("Connected");
            notification_timer = setInterval(function () {
                session.call('com.fitrangi.notifications', [user]).then(function (res) {
                    console.log("notifications_count() result:", res);
                }, function (err) {
                    console.log("notifications_count() error:", err);
                });
            }, 30000);
            var App = window.App || {}
            window.App.messaging = window.App.messaging || {};
            window.App.messaging.update_users = function () {
                $('#user-list').html('');
                var html = '';
                window.App.messaging.user_list = window.App.messaging.user_list || {};
                var user_list = window.App.messaging.user_list;
                var keys = Object.keys(window.App.messaging.user_list);
                for (var i = 0; i < keys.length; i++) {
                    var id = keys[i];
                    var name = user_list[keys[i]].name;
                    var image = user_list[keys[i]].image;
                    var notification = user_list[keys[i]].notifications;
                    var badge = '.';
                    if (notification != undefined && parseInt(notification) > 0) {
                        badge = '<span class="badge">' + notification + '</span>';
                    }
                    var selected_style = 'style="background-color:lightgrey;"';
                    if (window.App.messaging.selected_user != id) {
                        selected_style = '';
                    }
                    html += '<div class="contact" ' + selected_style + ' data-user-id="' + id + '" data-user-name="' + name + '" data-user-image="' + image + '">' + '<a class="pull-left">' + '<figure><img class="img-circle img-responsive" alt="" src="' + image + '"></figure>' + '</a>' + '<h5>' + name + '</h5><small id="user-notification-' + id + '">&nbsp;' + badge + '&nbsp;</small>' + '</div>'
                }
                $('.contact-list').html('');
                $('.contact-list').html(html);
            }
            window.App.messaging.update_messages = function () {
                window.App.messaging.selected_user = window.App.messaging.selected_user || null;
                var selected_user = window.App.messaging.selected_user;
                if (selected_user == undefined || selected_user == null)return;
                window.App.messaging.user_notification[selected_user] = window.App.messaging.user_notification[selected_user] || 0
                window.App.messaging.user_notification[selected_user] = 0
                var notification_badge = $('[id="user-notification-' + selected_user + '"]');
                if (notification_badge != undefined && notification_badge.length > 0) {
                    notification_badge.html('&nbsp;.&nbsp;');
                }
                var user_data = window.App.messaging.user_list[selected_user];
                $('#user-image').attr('src', user_data['image']);
                $('#user-name').html(user_data['name']);
                $('.messages').html('');
                $('.messages').attr('data-user-id', selected_user);
                var html = '';
                window.App.messaging.message_list[selected_user] = window.App.messaging.message_list[selected_user] || [];
                var message_list = window.App.messaging.message_list[selected_user];
                for (var i = 0; i < message_list.length; i++) {
                    var message_obj = message_list[i];
                    var my = message_obj.my;
                    var message = message_obj.message;
                    var image = message_obj.image;
                    var time = message_obj.time;
                    if (my != undefined && (my == true || my == 'true' || my == 'True')) {
                        whose = 'my';
                    } else {
                        whose = 'friend';
                    }
                    var state_wise_info = '<i class="fa fa-clock-o"></i> ' + time
                    html += '<li class="' + whose + '-message clearfix">' + '<figure class="profile-picture">' + '<img src="' + image + '" class="img-circle img-responsive" alt="">' + '</figure>' + '<div class="message">' + message + '<div class="time">' + state_wise_info + '</div>' + '</div>' + '</li>';
                }
                $('.messages').html(html);
            };
            var update_single_message = function (result) {
                if (result.messages != undefined && result.messages.length > 0) {
                    console.log('[*] ' + result.name + ": " + result.messages[0].message);
                }
                window.App.messaging.selected_user = window.App.messaging.selected_user || null;
                window.App.messaging.user_notification = window.App.messaging.user_notification || {};
                var selected_user = window.App.messaging.selected_user;
                if (selected_user == undefined || selected_user == null || selected_user != result.id) {
                    window.App.messaging.user_notification[result.id] = window.App.messaging.user_notification[result.id] || 0
                    window.App.messaging.user_notification[result.id] += 1
                    var notification_badge = $('[id="user-notification-' + result.id + '"]');
                    if (notification_badge != undefined && notification_badge.length > 0) {
                        notification_badge.html('&nbsp;<span class="badge">' + window.App.messaging.user_notification[result.id] + '</span>&nbsp;');
                    }
                    return;
                }
                var message_list = result.messages;
                var html = '';
                for (var i = 0; i < message_list.length; i++) {
                    var message_obj = message_list[i];
                    var my = message_obj.my;
                    var message = message_obj.message;
                    var image = message_obj.image;
                    var time = message_obj.time;
                    if (my != undefined && (my == true || my == 'true' || my == 'True')) {
                        whose = 'my';
                    } else {
                        whose = 'friend';
                    }
                    var state_wise_info = '<i class="fa fa-clock-o"></i> ' + time
                    html += '<li class="' + whose + '-message clearfix">' + '<figure class="profile-picture">' + '<img src="' + image + '" class="img-circle img-responsive" alt="">' + '</figure>' + '<div class="message">' + message + '<div class="time">' + state_wise_info + '</div>' + '</div>' + '</li>';
                }
                $('.messages').append(html);
            };
            var update_message_list = function (result) {
                var messages = result.messages;
                var user_id = result.id;
                window.App.messaging.user_list = window.App.messaging.user_list || {};
                if (!(user_id in window.App.messaging.user_list)) {
                    window.App.messaging.user_list[user_id] = {notifications: result.notifications, image: result.image, name: result.name};
                }
                window.App.messaging.message_list = window.App.messaging.message_list || {};
                window.App.messaging.message_list[user_id] = window.App.messaging.message_list[user_id] || [];
                for (var i = 0; i < messages.length; i++) {
                    window.App.messaging.message_list[user_id].push({message: messages[i].message, my: messages[i].my, image: messages[i].image, time: messages[i].time});
                }
                update_single_message(result);
            };
            var message_received = function on_message(args) {
                console.log(args);
                update_message_list(args[0]);
            }
            window.App.messaging.subscribe = function () {
                session.subscribe('com.fitrangi.messaging.listener.' + user, message_received).then(function (sub) {
                    console.log('subscribed to topic');
                }, function (err) {
                    console.log('failed to subscribe to topic', err);
                });
            }
            window.App.messaging.send = function (message, to_user) {
                session.call('com.fitrangi.messaging.send', [user, to_user, message]).then(function (res) {
                    update_message_list(res);
                }, function (err) {
                    console.log('Error sending message: ' + err);
                });
            };
            window.App.messaging.all = function (initial) {
                var data = [user];
                if (initial != undefined && initial != null) {
                    data.push(initial)
                }
                session.call('com.fitrangi.messaging.all', data).then(function (res) {
                    for (var i = 0; i < res.length; i++) {
                        update_message_list(res[i]);
                        if (window.App.messaging.selected_user == undefined || window.App.messaging.selected_user.length == 0) {
                            if (i == 0) {
                                window.App.messaging.selected_user = res[i].id;
                            }
                        }
                    }
                    window.App.messaging.update_users();
                    window.App.messaging.update_messages();
                }, function (err) {
                    console.log('Error: ' + err)
                });
            }
            if (window.App.messaging.on_chat != undefined && window.App.messaging.on_chat) {
                if (window.App.messaging.initial_user != undefined && window.App.messaging.initial_user.length > 0) {
                    window.App.messaging.all(window.App.messaging.initial_user);
                } else {
                    window.App.messaging.all();
                }
                window.App.messaging.subscribe();
            }
        };
        connection.onclose = function (reason, details) {
            console.log("Connection lost: " + reason);
            if (notification_timer) {
                clearInterval(notification_timer);
                notification_timer = null;
            }
        }
        reset_users_messages();
        connection.open();
    };
    if (attr != undefined && attr.length > 0 && attr != 'null') {
        console.log('Connecting to aync server for user [' + attr + ']');
        connect_async(attr);
    }
});