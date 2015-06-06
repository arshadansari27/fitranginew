/**
 * Created by arshad on 09/04/15.
 */
$(document).ready(function() {
    console.log('profile-editor.js');
    var App = window.App || {};
    App.profile = App.profile || {};

    App.profile.reset_counter = function(node, action, callback) {
        var options = {
            node: node,
            action: action,
            type: 'profile',
            command: 'reset-activity-count'
        }
        App.editor(options, callback);
    };

    App.profile.report_not_ok = function(node, node_type, user_id, callback) {
        var options = {
            node: node,
            data: {
                user_id: user_id,
                node_type: node_type
            },
            type: 'profile',
            command: 'not-ok'
        };
        App.editor(options, callback);
    };

    App.profile.claim_profile = function(node, node_type, user_id, callback) {
        var options = {
            node: node,
            data: {
                user_id: user_id,
                node_type: node_type
            },
            type: 'profile',
            command: 'claim-profile'
        };
        App.editor(options, callback);
    };

    App.profile.update_counter = function(node) {
		$.ajax({
    		type: 'GET',
    		url: '/notifications-count',
    		success: function(data) {
                if (data.status=='error' && data.message == 'Please login before making requests'){
                    return;
                }
    		    var public = data.public_activity_count;
    		    var private = data.private_activity_count;
                    if($('#public-activity-count') != undefined){
                        $('#public-activity-count').html('' + public);
                    }
                    if($('#private-activity-count') != undefined){
                        $('#private-activity-count').html('' + private);
                    }
    		},
    		contentType: "application/json",
    		dataType: 'json'
		});
    }

    App.profile.edit_profile = function(node, data, callback) {
        var options = {
            node: node,
            data: data,
            type: 'profile',
            command: 'edit-profile'
        };
        App.editor(options, callback);
    };

    App.profile.switch_profile = function(node, profile, callback) {
        var options = {
            node: node,
            data: {profile: profile},
            type: 'profile',
            command: 'switch-profile'
        };
        App.editor(options, callback);
    };

    App.profile.add_activity_to_favorite = function(node, activity, callback) {
        var options = {
            node: node,
            activity: activity,
            type: 'profile',
            command: 'favorite-activity',
            action: 'add'
        };
        App.editor(options, callback);
    };

    App.profile.remove_activity_from_favorite = function(node, activity, callback) {
        var options = {
            node: node,
            activity: activity,
            type: 'profile',
            command: 'favorite-activity',
            action: 'remove'
        };
        App.editor(options, callback);
    };

    App.profile.add_adventure_to_wish_list= function(node, adventure, callback) {
        var options = {
            node: node,
            adventure: adventure,
            type: 'profile',
            command: 'wish-list-adventure',
            action: 'add'
        };
        App.editor(options, callback);
    };

    App.profile.remove_adventure_from_wish_list = function(node, adventure, callback) {
        var options = {
            node: node,
            adventure: adventure,
            type: 'profile',
            command: 'wish-list-adventure',
            action: 'remove'
        };
        App.editor(options, callback);
    };

    App.profile.add_adventure_to_done = function(node, adventure, callback) {
        var options = {
            node: node,
            adventure: adventure,
            type: 'profile',
            command: 'accomplish-adventure',
            action: 'add'
        };
        App.editor(options, callback);
    };

    App.profile.remove_adventure_from_done = function(node, adventure, callback) {
        var options = {
            node: node,
            adventure: adventure,
            type: 'profile',
            command: 'accomplish-adventure',
            action: 'remove'
        }
        App.editor(options, callback);
    };
        //Armash Work Starts Here
    App.profile.add_profile_to_follow= function(node, other_profile, callback) {
        var options = {
            node: node,
            other_profile: other_profile,
            type: 'profile',
            command: 'follow-profile',
            action: 'follow'
        };
        App.editor(options, callback);
    };

    App.profile.remove_profile_from_follow= function(node, other_profile, callback) {
        var options = {
            node: node,
            other_profile: other_profile,
            type: 'profile',
            command: 'follow-profile',
            action: 'unfollow'
        };
        App.editor(options, callback);
    };

    App.profile.add_article_to_bookmark= function(node, article, callback) {
        var options = {
            node: node,
            article: article,
            type: 'profile',
            command: 'bookmark-article',
            action: 'add'
        };
        App.editor(options, callback);
    };

    App.profile.remove_article_from_bookmark= function(node, article, callback) {
        var options = {
            node: node,
            article: article,
            type: 'profile',
            command: 'bookmark-article',
            action: 'remove'
        };
        App.editor(options);
    };

    App.profile.add_event_to_interest= function(node, event, callback) {
        var options = {
            node: node,
            event: event,
            type: 'profile',
            command: 'interest-event',
            action: 'add'
        }
        App.editor(options, callback);
    };

    App.profile.remove_event_from_interest= function(node, event, callback) {
        var options = {
            node: node,
            event: event,
            type: 'profile',
            command: 'interest-event',
            action: 'remove'
        };
        App.editor(options, callback);
    };

    App.profile.add_event_to_join= function(node, event, callback) {
        var options = {
            node: node,
            event: event,
            type: 'profile',
            command: 'join-event',
            action: 'add'
        };
        App.editor(options, callback);
    };

    App.profile.remove_event_from_join= function(node, event, callback) {
        var options = {
            node: node,
            event: event,
            type: 'profile',
            command: 'join-event',
            action: 'remove'
        };
        App.editor(options, callback);
    };

    App.profile.add_trip_to_interest= function(node, trip, callback) {
        var options = {
            node: node,
            trip: trip,
            type: 'profile',
            command: 'interest-trip',
            action: 'add'
        };
        App.editor(options, callback);
    };

    App.profile.remove_trip_from_interest= function(node, trip, callback) {
        var options = {
            node: node,
            trip: trip,
            type: 'profile',
            command: 'interest-trip',
            action: 'remove'
        };
        App.editor(options, callback);
    };

    App.profile.add_trip_to_join= function(node, trip, callback) {
        var options = {
            node: node,
            trip: trip,
            type: 'profile',
            command: 'join-trip',
            action: 'add'
        };
        App.editor(options, callback);
    };

    App.profile.remove_trip_from_join= function(node, trip, callback) {
        var options = {
            node: node,
            trip: trip,
            type: 'profile',
            command: 'join-trip',
            action: 'remove'
        };
        App.editor(options, callback);
    };

    App.profile.book_trip = function(name, email, phone, message, trip, callback) {
        var options = {
            name: name,
            email: email,
            phone: phone,
            message: message,
            trip: trip,
            type: 'profile',
            command: 'book-enquiry-trip',
            action: ''
        };
        App.editor(options, callback);
    };

    App.profile.verify_profile= function(node, data) {
        var options = {
            node: node,
            data: data,
            type: 'profile',
            command: 'verify-profile'
        };
        App.editor(options);
    };

    App.profile.edit_profile_preference= function(node, data, callback) {
        var options = {
            node: node,
            data: data,
            type: 'profile',
            command: 'preference-edit'
        };
        App.editor(options, callback);
    };

    App.profile.edit_type= function(node, type) {
        var options = {
            node: node,
            type: type,
            type: 'profile',
            command: 'profile-type-edit'
        };
        App.editor(options);
    };

    App.profile.register_profile= function(name, email, password, callback) {
        var options = {
            data: {name: name, email: email, password: password},
            type: 'profile',
            command: 'register-profile'
        };
        App.editor(options, callback);
    };

    App.profile.business_profile_register = function(data, callback) {
        var options = {
            data: data,
            type: 'profile',
            command: 'register-business-profile'
        };
        App.editor(options, callback);
    };

    App.profile.subscribe = function(name, email, callback) {
        var options = {
            data: {name: name, email: email},
            type: 'profile',
            command: 'subscribe'
        };
        App.editor(options, callback);
    };

    App.profile.business_profile_edit= function(node, data, callback) {
        var options = {
            node: node,
            data: data,
            type: 'profile',
            command: 'business-profile-edit'
        };
        App.editor(options, callback);
    };

    App.profile.edit_role= function(node, role) {
        var options = {
            node: node,
            role: role,
            type: 'profile',
            command: 'role-edit'
        };
        App.editor(options);
    };

    App.profile.deactivate_profile= function(node) {
        var options = {
            node: node,
            type: 'profile',
            command: 'deactivate-profile'
        };
        App.editor(options);
    };

    App.profile.edit_cover_image= function(node, image_url) {
        var options = {
            node: node,
            image_url: image_url,
            type: 'profile',
            command: 'cover-image-edit'
        };
        App.editor(options);
    };

    App.profile.change_password= function(node, current_password, new_password, callback) {
        var options = {
            node: node,
            data: {
                old: current_password,
                new: new_password
            },
            type: 'profile',
            command: 'change-password'
        };
        App.editor(options, callback);
    };


});
