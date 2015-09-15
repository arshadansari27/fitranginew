/**
 * Created by arshad on 09/04/15.
 */
$(document).ready(function() {
    console.log('campsite-edit.js');
    var App = window.App;
    App.campsite = App.campsite || {};


    App.campsite.add = function(data, callback) {
        var options = {
            command: 'add',
            type: 'campsite',
            data: data
        };
        App.editor(options, callback);
    };

    App.campsite.edit = function(node, data, callback) {
        var options = {
            node: node,
            type: 'campsite',
            command: 'edit',
            data: data
        };
        App.editor(options, callback);
    };

    App.campsite.delete = function(node, type, callback) {
        var options = {
            node: node,
            command: 'delete',
            type: 'campsite'
        };
        App.editor(options, callback);
    };

    App.campsite.delete_media = function(node, media, callback) {
        var options = {
            node: node,
            command: 'delete-gallery-media',
            type: 'campsite',
            data: {media: media}
        };
        App.editor(options, callback);
    };


});
