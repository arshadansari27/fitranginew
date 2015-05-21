jQuery(document).ready(function ($) {
    var App = App || {};
    App.log = function (logThis) {
        console.log(logThis);
    };
    App.editor = function (options) {
        var callback = null;
        if (arguments.length > 1) {
            callback = arguments[1]
        }
        $('#loadingImage').show();
        $.ajax({type: 'POST', url: '/editors/invoke', data: JSON.stringify(options), success: function (data) {
            $('#loadingImage').hide();
            if (data.status == 'error' && data.message == 'Please login before making requests') {
                App.show_login();
            }
            console.log(data);
            if (callback != null) {
                callback(data);
            } else {
                setTimeout(function () {
                    window.location.reload();
                }, 1000);
            }
        }, contentType: "application/json", dataType: 'json'});
    };
    App.base_editor = {save_image_cover: function (model, model_id, url) {
        App.editor({type: 'profile', command: 'save-cover', data: {model: model_id, url: url}})
    }}
    App.filter = function (id) {
        var input = $('#' + id);
        var category = input.attr('data-category');
        if (category == null || category == undefined || category.length == 0)category = 'all';
        var model = input.attr('data-model');
        var filters = model;
        window.filters = window.filters || {};
        window.filters[filters] = window.filters[filters] || [];
        var filters_list = window.filters[filters];
        console.log('Adding filter for [' + model + '] [' + category + ']: ' + id);
        filters_list.push(id);
    };
    App.uploader = function (dialogRef) {
        var data = new FormData();
        jQuery.each(jQuery('input[type=file]')[0].files, function (i, file) {
            data.append('file-' + i, file);
        });
        if (data.length == 0) {
            return;
        }
        dialogRef.enableButtons(false);
        dialogRef.setClosable(false);
        dialogRef.getModalBody().prepend('<img class="loading-icon" src="/img/loading.gif">');
        jQuery.ajax({url: '/dialog/upload_image', data: data, cache: false, contentType: false, processData: false, type: 'POST', success: function (data) {
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
        }, error: function (data) {
            $('.alert').html('<div class="alert-message">Failed to upload the image, try again later.</div>');
            $('.alert').addClass('alert-warning');
            $('.alert').show();
        }});
    };
    window.App = App;
});
$(document).ready(function () {
    console.log('profile-editor.js');
    var App = window.App;
    App.profile = App.profile || {};
    App.profile.reset_counter = function (node, action, callback) {
        var options = {node: node, action: action, type: 'profile', command: 'reset-activity-count'}
        App.editor(options, callback);
    };
    App.profile.update_counter = function (node) {
        $.ajax({type: 'GET', url: '/notifications-count', success: function (data) {
            if (data.status == 'error' && data.message == 'Please login before making requests') {
                return;
            }
            var public = data.public_activity_count;
            var private = data.private_activity_count;
            if ($('#public-activity-count') != undefined) {
                $('#public-activity-count').html('' + public);
            }
            if ($('#private-activity-count') != undefined) {
                $('#private-activity-count').html('' + private);
            }
        }, contentType: "application/json", dataType: 'json'});
    }
    App.profile.edit_profile = function (node, data, callback) {
        var options = {node: node, data: data, type: 'profile', command: 'edit-profile'};
        App.editor(options, callback);
    };
    App.profile.add_activity_to_favorite = function (node, activity) {
        var options = {node: node, activity: activity, type: 'profile', command: 'favorite-activity', action: 'add'};
        App.editor(options);
    };
    App.profile.remove_activity_from_favorite = function (node, activity) {
        var options = {node: node, activity: activity, type: 'profile', command: 'favorite-activity', action: 'remove'};
        App.editor(options);
    };
    App.profile.add_adventure_to_wish_list = function (node, adventure) {
        var options = {node: node, adventure: adventure, type: 'profile', command: 'wish-list-adventure', action: 'add'};
        App.editor(options);
    };
    App.profile.remove_adventure_from_wish_list = function (node, adventure) {
        var options = {node: node, adventure: adventure, type: 'profile', command: 'wish-list-adventure', action: 'remove'};
        App.editor(options);
    };
    App.profile.add_adventure_to_done = function (node, adventure) {
        var options = {node: node, adventure: adventure, type: 'profile', command: 'accomplish-adventure', action: 'add'};
        App.editor(options);
    };
    App.profile.remove_adventure_from_done = function (node, adventure) {
        var options = {node: node, adventure: adventure, type: 'profile', command: 'accomplish-adventure', action: 'remove'}
        App.editor(options);
    };
    App.profile.add_profile_to_follow = function (node, other_profile) {
        var options = {node: node, other_profile: other_profile, type: 'profile', command: 'follow-profile', action: 'follow'};
        App.editor(options);
    };
    App.profile.remove_profile_from_follow = function (node, other_profile) {
        var options = {node: node, other_profile: other_profile, type: 'profile', command: 'follow-profile', action: 'unfollow'};
        App.editor(options);
    };
    App.profile.add_article_to_bookmark = function (node, article) {
        var options = {node: node, article: article, type: 'profile', command: 'bookmark-article', action: 'add'};
        App.editor(options);
    };
    App.profile.remove_article_from_bookmark = function (node, article) {
        var options = {node: node, article: article, type: 'profile', command: 'bookmark-article', action: 'remove'};
        App.editor(options);
    };
    App.profile.add_event_to_interest = function (node, event) {
        var options = {node: node, event: event, type: 'profile', command: 'interest-event', action: 'add'}
        App.editor(options);
    };
    App.profile.remove_event_from_interest = function (node, event) {
        var options = {node: node, event: event, type: 'profile', command: 'interest-event', action: 'remove'};
        App.editor(options);
    };
    App.profile.add_event_to_join = function (node, event) {
        var options = {node: node, event: event, type: 'profile', command: 'join-event', action: 'add'};
        App.editor(options);
    };
    App.profile.remove_event_from_join = function (node, event) {
        var options = {node: node, event: event, type: 'profile', command: 'join-event', action: 'remove'};
        App.editor(options);
    };
    App.profile.add_trip_to_interest = function (node, trip) {
        var options = {node: node, trip: trip, type: 'profile', command: 'interest-trip', action: 'add'};
        App.editor(options);
    };
    App.profile.remove_trip_from_interest = function (node, trip) {
        var options = {node: node, trip: trip, type: 'profile', command: 'interest-trip', action: 'remove'};
        App.editor(options);
    };
    App.profile.add_trip_to_join = function (node, trip) {
        var options = {node: node, trip: trip, type: 'profile', command: 'join-trip', action: 'add'};
        App.editor(options);
    };
    App.profile.remove_trip_from_join = function (node, trip) {
        var options = {node: node, trip: trip, type: 'profile', command: 'join-trip', action: 'remove'};
        App.editor(options);
    };
    App.profile.book_trip = function (name, email, phone, message, trip) {
        var options = {name: name, email: email, phone: phone, message: message, trip: trip, type: 'profile', command: 'book-enquiry-trip', action: ''};
        App.editor(options);
    };
    App.profile.verify_profile = function (node, data) {
        var options = {node: node, data: data, type: 'profile', command: 'verify-profile'};
        App.editor(options);
    };
    App.profile.edit_profile_preference = function (node, data, callback) {
        var options = {node: node, data: data, type: 'profile', command: 'preference-edit'};
        App.editor(options, callback);
    };
    App.profile.edit_type = function (node, type) {
        var options = {node: node, type: type, type: 'profile', command: 'profile-type-edit'};
        App.editor(options);
    };
    App.profile.register_profile = function (name, email, password, callback) {
        var options = {data: {name: name, email: email, password: password}, type: 'profile', command: 'register-profile'};
        App.editor(options, callback);
    };
    App.profile.subscribe = function (name, email, callback) {
        var options = {data: {name: name, email: email}, type: 'profile', command: 'subscribe'};
        App.editor(options, callback);
    };
    App.profile.business_profile_edit = function (node, data) {
        var options = {node: node, data: data, type: 'profile', command: 'business-profile-edit'};
        App.editor(options);
    };
    App.profile.edit_role = function (node, role) {
        var options = {node: node, role: role, type: 'profile', command: 'role-edit'};
        App.editor(options);
    };
    App.profile.deactivate_profile = function (node) {
        var options = {node: node, type: 'profile', command: 'deactivate-profile'};
        App.editor(options);
    };
    App.profile.edit_cover_image = function (node, image_url) {
        var options = {node: node, image_url: image_url, type: 'profile', command: 'cover-image-edit'};
        App.editor(options);
    };
    App.profile.change_password = function (node, current_password, new_password, callback) {
        var options = {node: node, data: {old: current_password, new: new_password}, type: 'profile', command: 'change-password'};
        App.editor(options, callback);
    };
});
$(document).ready(function () {
    console.log('post-editor.js');
    var App = window.App;
    App.post = App.post || {};
    App.post.add = function (image, post_type, parent_type, parent, content, callback) {
        var data = {image: image, post_type: post_type, parent_type: parent_type, parent: parent, content: content};
        var options = {data: data, type: 'post', command: 'add'};
        App.editor(options, callback);
    };
    App.post.delete = function (node, callback) {
        var options = {node: node, type: 'post', command: 'delete'}
        App.editor(options, callback);
    };
    App.post.comment = function (node, content, callback) {
        var data = {content: content}
        var options = {node: node, type: 'post', command: 'comment', data: data}
        App.editor(options, callback);
    };
    App.post.vote = function (node, up, callback) {
        var data = {up: up}
        var options = {node: node, type: 'post', command: 'vote', data: data}
        App.editor(options, callback);
    };
    App.post.delete = function (node, callback) {
        console.log('Not implemented');
    };
});
$(document).ready(function () {
    console.log('content-editor.js');
    var App = window.App;
    App.content = App.content || {};
    App.content.add = function (type, title, description, video, image, channels, tags, content, callback) {
        var data = {title: title, description: description, video: video, image: image, channels: channels, tags: tags, content: content}
        var options = {command: 'add', type: type, data: data};
        App.editor(options, callback);
    };
    App.content.edit = function (node, type, title, description, video, image, channels, tags, content, callback) {
        var data = {title: title, description: description, video: video, image: image, channels: channels, tags: tags, content: content}
        var options = {node: node, type: type, command: 'edit', data: data}
        App.editor(options, callback);
    };
    App.content.publish = function (node, type, callback) {
        var options = {node: node, type: type, command: 'publish'}
        App.editor(options, callback);
    };
    App.content.unpublish = function (node, type, callback) {
        var options = {node: node, type: type, command: 'unpublish'}
        App.editor(options, callback);
    };
    App.content.delete = function (node, type, callback) {
        var options = {node: node, command: 'delete', type: type}
        App.editor(options, callback);
    };
});