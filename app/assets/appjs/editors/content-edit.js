/**
 * Created by arshad on 09/04/15.
 */
$(document).ready(function() {
    console.log('content-editor.js');
    var App = window.App;
    App.content = App.content || {};


    App.content.add = function(node, type, data) {
        options = {
            node: node,
            data: data,
            type: type,
            command: 'edit-profile'
        };
        App.editor(options);
    };

    App.content.edit = function(node, type) {
        options = {
            node: node,
            type: type,
            command: 'favorite-activity',
            action: 'add'
        }
        App.editor(options);
    };

    App.content.publish= function(node, type) {
        options = {
            node: node,
            type: type,
            command: 'favorite-activity',
            action: 'remove'
        }
        App.editor(options);
    };

    App.content.unpublish = function(node, type) {
        options = {
            node: node,
            type: type,
            command: 'wish-list-adventure',
            action: 'add'
        }
        App.editor(options);
    };

    App.content.delete = function(node, type) {
        options = {
            node: node,
            type: type,
            command: 'wish-list-adventure',
            action: 'remove'
        }
        App.editor(options);
    };


});
