/**
 * Created by arshad on 09/04/15.
 */
$(document).ready(function() {
    console.log('content-editor.js');
    var App = window.App;
    App.content = App.content || {};

    App.content.answer_contest = function(user, content, answers){
        var data = {
            answers: answers,
            content: content,
            user: user
        };
        var options = {
            command: 'answer-contest',
            node: content,
            type: 'contest',
            data: data
        }
        App.editor(options, function(data){
            //window.location.reload();
            if (data.status == 'success') {
                BootstrapDialog.show({
                    message: 'Thank you for participating! you will be notified once the results announce',
                    onhidden: function (dialogRef) {
                        window.location.href="/contests";
                    }
                });
            } else {

                BootstrapDialog.alert('Something went wrong, please try again later!');
            }
        });
    };

    App.content.add = function(type, title, description, video, image, channels, tags, content, callback) {
        var data = {
            title: title,
            description: description,
            video: video,
            image: image,
            channels: channels,
            tags: tags,
            content: content
        }
        var options = {
            command: 'add',
            type: type,
            data: data
        };
        App.editor(options, callback);
    };

    App.content.edit = function(node, type, title, description, video, image, channels, tags, content, callback) {
        var data = {
            title: title,
            description: description,
            video: video,
            image: image,
            channels: channels,
            tags: tags,
            content: content
        }
        var options = {
            node: node,
            type: type,
            command: 'edit',
            data: data
        }
        App.editor(options, callback);
    };

    App.content.publish= function(node, type, callback) {
        var options = {
            node: node,
            type: type,
            command: 'publish'
        }
        App.editor(options, callback);
    };

    App.content.unpublish = function(node, type, callback) {
        var options = {
            node: node,
            type: type,
            command: 'unpublish'
        }
        App.editor(options, callback);
    };

    App.content.delete = function(node, type, callback) {
        var options = {
            node: node,
            command: 'delete',
            type: type
        }
        App.editor(options, callback);
    };


});
