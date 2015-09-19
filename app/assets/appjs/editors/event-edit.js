/**
 * Created by arshad on 09/04/15.
 */
$(document).ready(function() {
    console.log('event-edit.js');
    var App = window.App;
    App.event = App.event || {};


    App.event.add = function(data, callback) {
        var options = {
            command: 'add',
            type: 'event',
            data: data
        };
        App.editor(options, callback);
    };

    App.event.edit = function(node, data, callback) {
        var options = {
            node: node,
            type: 'event',
            command: 'edit',
            data: data
        };
        App.editor(options, callback);
    };

    App.event.delete = function(node, type, callback) {
        var options = {
            node: node,
            command: 'delete',
            type: 'event'
        };
        App.editor(options, callback);
    };

});
