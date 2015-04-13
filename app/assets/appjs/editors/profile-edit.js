/**
 * Created by arshad on 09/04/15.
 */
$(document).ready(function() {
    console.log('profile-editor.js');
    var App = window.App;
    App.profile = App.profile || {};


    App.profile.edit_profile = function(node, data) {
        options = {
            node: node,
            data: data,
            type: 'profile',
            command: 'edit-profile'
        }
        App.editor(options);
    }

    App.profile.add_activity_to_favorite = function(node, activity) {
        options = {
            node: node,
            activity: activity,
            type: 'profile',
            command: 'favorite-activity',
            action: 'add'
        }
        App.editor(options);
    };

    App.profile.remove_activity_from_favorite = function(node, activity) {
        options = {
            node: node,
            activity: activity,
            type: 'profile',
            command: 'favorite-activity',
            action: 'remove'
        }
        App.editor(options);
    };

    App.profile.add_adventure_to_wish_list= function(node, adventure) {
        options = {
            node: node,
            adventure: adventure,
            type: 'profile',
            command: 'wish-list-adventure',
            action: 'add'
        }
        App.editor(options);
    };

    App.profile.remove_adventure_from_wish_list = function(node, adventure) {
        options = {
            node: node,
            adventure: adventure,
            type: 'profile',
            command: 'wish-list-adventure',
            action: 'remove'
        }
        App.editor(options);
    };

    App.profile.add_adventure_to_done = function(node, adventure) {
        options = {
            node: node,
            adventure: adventure,
            type: 'profile',
            command: 'accomplish-adventure',
            action: 'add'
        }
        App.editor(options);
    };

    App.profile.remove_adventure_from_done = function(node, adventure) {
        options = {
            node: node,
            adventure: adventure,
            type: 'profile',
            command: 'accomplish-adventure',
            action: 'remove'
        }
        App.editor(options);
    };
        //Armash Work Starts Here
    App.profile.add_profile_to_follow= function(node, other_profile) {
        options = {
            node: node,
            other_profile: other_profile,
            type: 'profile',
            command: 'follow-profile',
            action: 'add'
        }
        App.editor(options);
    };

    App.profile.remove_profile_from_follow= function(node, other_profile) {
        options = {
            node: node,
            other_profile: other_profile,
            type: 'profile',
            command: 'follow-profile',
            action: 'remove'
        }
        App.editor(options);
    };

    App.profile.add_article_to_bookmark= function(node, article) {
        options = {
            node: node,
            article: article,
            type: 'profile',
            command: 'bookmark-article',
            action: 'add'
        }
        App.editor(options);
    };

    App.profile.remove_article_from_bookmark= function(node, article) {
        options = {
            node: node,
            article: article,
            type: 'profile',
            command: 'bookmark-article',
            action: 'remove'
        }
        App.editor(options);
    };

    App.profile.add_event_to_interest= function(node, event) {
        options = {
            node: node,
            event: event,
            type: 'profile',
            command: 'interest-event',
            action: 'add'
        }
        App.editor(options);
    };

    App.profile.remove_event_from_interest= function(node, event) {
        options = {
            node: node,
            event: event,
            type: 'profile',
            command: 'interest-event',
            action: 'remove'
        }
        App.editor(options);
    };

    App.profile.add_event_to_join= function(node, event) {
        options = {
            node: node,
            event: event,
            type: 'profile',
            command: 'join-event',
            action: 'add'
        }
        App.editor(options);
    };

    App.profile.remove_event_from_join= function(node, event) {
        options = {
            node: node,
            event: event,
            type: 'profile',
            command: 'join-event',
            action: 'remove'
        }
        App.editor(options);
    };

    App.profile.add_trip_to_interest= function(node, trip) {
        options = {
            node: node,
            trip: trip,
            type: 'profile',
            command: 'interest-trip',
            action: 'add'
        }
        App.editor(options);
    };

    App.profile.remove_trip_from_interest= function(node, trip) {
        options = {
            node: node,
            trip: trip,
            type: 'profile',
            command: 'interest-trip',
            action: 'remove'
        }
        App.editor(options);
    };

    App.profile.add_trip_to_join= function(node, trip) {
        options = {
            node: node,
            trip: trip,
            type: 'profile',
            command: 'join-trip',
            action: 'add'
        }
        App.editor(options);
    };

    App.profile.remove_trip_from_join= function(node, trip) {
        options = {
            node: node,
            trip: trip,
            type: 'profile',
            command: 'join-trip',
            action: 'remove'
        }
        App.editor(options);
    };

    App.profile.verify_profile= function(node, data) {
        options = {
            node: node,
            data: data,
            type: 'profile',
            command: 'verify-profile'
        }
        App.editor(options);
    };

    App.profile.edit_profile_preference= function(node, data) {
        options = {
            node: node,
            data: data,
            type: 'profile',
            command: 'preference-edit'
        }
        App.editor(options);
    };

    App.profile.edit_type= function(node, type) {
        options = {
            node: node,
            type: type,
            type: 'profile',
            command: 'profile-type-edit'
        }
        App.editor(options);
    };

    App.profile.register_profile= function(data) {
        options = {
            data: data,
            type: 'profile',
            command: 'register-profile'
        }
        App.editor(options);
    };

    App.profile.business_profile_edit= function(node, data) {
        options = {
            node: node,
            data: data,
            type: 'profile',
            command: 'business-profile-edit'
        }
        App.editor(options);
    };

    App.profile.edit_role= function(node, role) {
        options = {
            node: node,
            role: role,
            type: 'profile',
            command: 'role-edit'
        }
        App.editor(options);
    };

    App.profile.deactivate_profile= function(node) {
        options = {
            node: node,
            type: 'profile',
            command: 'deactivate-profile'
        }
        App.editor(options);
    };

    App.profile.edit_cover_image= function(node, image_url) {
        options = {
            node: node,
            image_url: image_url,
            type: 'profile',
            command: 'cover-image-edit'
        }
        App.editor(options);
    };

    App.profile.change_password= function(node, current_password, new_password, confirm_password) {
        options = {
            node: node,
            current_password: current_password,
            new_password: new_password,
            confirm_password: confirm_password,
            type: 'profile',
            command: 'change-password'
        }
        App.editor(options);
    };


});
