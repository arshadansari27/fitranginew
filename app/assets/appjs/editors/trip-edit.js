/**
 * Created by arshad on 09/04/15.
 */
$(document).ready(function() {
    console.log('trip-edit.js');
    var App = window.App;
    App.trip = App.trip || {};


    App.trip.add = function(data, callback) {
        var options = {
            command: 'add',
            type: 'trip',
            data: data
        };
        App.editor(options, callback);
    };

    App.trip.edit = function(node, data, callback) {
        var options = {
            node: node,
            type: 'trip',
            command: 'edit',
            data: data
        };
        App.editor(options, callback);
    };

    App.trip.delete = function(node, type, callback) {
        var options = {
            node: node,
            command: 'delete',
            type: 'trip'
        };
        App.editor(options, callback);
    };

    App.trip.delete_media = function(node, media, callback) {
        var options = {
            node: node,
            command: 'delete-gallery-media',
            type: 'trip',
            data: {media: media}
        };
        App.editor(options, callback);
    };


});
