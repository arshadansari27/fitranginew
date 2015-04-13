/**
 * Created by arshad on 09/04/15.
 */
$(document).ready(function() {
    console.log('post-editor.js');
    var App = window.App;
    App.post = App.post || {};


    App.post.add = function(node, image, post_type, parent_type, parent, content, callback) {
        data = {
            image: image,
            post_type: post_type,
            parent_type: parent_type,
            parent: parent,
            content: content
        };
        options = {
            node: node,
            data: data,
            type: 'post',
            command: 'add'
        };
        App.editor(options, callback);
    };

    App.post.delete = function(node, callback) {
        options = {
            node: node,
            type: 'post',
            command: 'delete'
        }
        App.editor(options, callback);
    };

    App.post.comment = function(node, content, callback) {
        data = {
            content: content
        }
        options = {
            node: node,
            type: 'post',
            command: 'comment',
            data: data
        }
        App.editor(options, callback);
    };

    App.post.vote = function(node, up, callback) {
        data = {
            up: up
        }
        options = {
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
