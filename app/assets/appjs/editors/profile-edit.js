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
            adventure: other_profile,
            type: 'profile',
            command: 'follow-profile',
            action: 'add'
        }
        App.editor(options);
    };


});
