/**
 * Created by arshad on 09/04/15.
 */
$(document).ready(function() {
    console.log('gear-edit.js');
    var App = window.App;
    App.gear = App.gear || {};


    App.gear.add = function(data, callback) {
        var options = {
            command: 'add',
            type: 'gear',
            data: data
        };
        App.editor(options, callback);
    };

    App.gear.edit = function(node, data, callback) {
        var options = {
            node: node,
            type: 'gear',
            command: 'edit',
            data: data
        };
        App.editor(options, callback);
    };

    App.gear.delete = function(node, type, callback) {
        var options = {
            node: node,
            command: 'delete',
            type: 'gear'
        };
        App.editor(options, callback);
    };

    App.gear.delete_media = function(node, media, callback) {
        var options = {
            node: node,
            command: 'delete-gallery-media',
            type: 'gear',
            data: {media: media}
        };
        App.editor(options, callback);
    };


});
