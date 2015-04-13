/**
 * Created by arshad on 09/04/15.
 */
$(document).ready(function() {
    console.log('post-editor.js');
    var App = window.App;
    App.post = App.post || {};


    App.post.add = function(image, post_type, parent_type, parent, content, callback) {
        var data = {
            image: image,
            post_type: post_type,
            parent_type: parent_type,
            parent: parent,
            content: content
        };
        var options = {
            data: data,
            type: 'post',
            command: 'add'
        };
        App.editor(options, callback);
    };

    App.post.delete = function(node, callback) {
        var options = {
            node: node,
            type: 'post',
            command: 'delete'
        }
        App.editor(options, callback);
    };

    App.post.comment = function(node, content, callback) {
        var data = {
            content: content
        }
        var options = {
            node: node,
            type: 'post',
            command: 'comment',
            data: data
        }
        App.editor(options, callback);
    };

    App.post.vote = function(node, up, callback) {
        var data = {
            up: up
        }
        var options = {
            node: node,
            type: 'post',
            command: 'vote',
            data: data
        }
        App.editor(options, callback);
    };

    App.post.delete = function(node, callback) {
        console.log('Not implemented');
    };


});
