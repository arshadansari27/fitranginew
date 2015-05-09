$(document).ready(function() {
         // the URL of the WAMP Router (Crossbar.io)
         //
         var attr = $('body').attr('data-logged-in-as');
         var logged_in_user = attr;

         var reset_users_messages = function(){

            window.App.messaging = window.App.messaging || {};
            window.App.messaging.message_list = {};
            window.App.messaging.user_list =  {};
         };


         var connect_async = function(user) {
            var wsuri;
            if (document.location.origin == "file://") {
                wsuri = "ws://127.0.0.1:8080/ws";
            } else {

                var loc = null;
                if (document.location.host.indexOf(':4500') != -1) {
                    loc = document.location.host.replace(':4500', ':8080');
                } else if (document.location.host.indexOf(':8080') != -1) {
                    loc = document.location.host;
                } else {
                    loc = document.location.host + ":8080";
                }
                wsuri = (document.location.protocol === "http:" ? "ws:" : "wss:") + "//" +
                        loc + "/ws";
            }


            var connection = new autobahn.Connection({
                url: wsuri,
                realm: "realm1"
            });

            var notification_timer;
            connection.onopen = function (session, details) {

                console.log("Connected");

                notification_timer = setInterval(function () {
                    session.call('com.fitrangi.notifications', [user]).then(
                        function (res) {
                            console.log("notifications_count() result:", res);
                        },
                        function (err) {
                            console.log("notifications_count() error:", err);
                        }
                    );
                }, 30000);

                var App = window.App || {}
                window.App.messaging = window.App.messaging || {};

                window.App.messaging.update_users = function() {
                    $('#user-list').html('');
                    var html = '';
                    window.App.messaging.user_list = window.App.messaging.user_list || {};
                    var user_list = window.App.messaging.user_list;
                    var keys = Object.keys(window.App.messaging.user_list);
                    for(var i = 0; i < keys.length; i++) {
                        var id              = keys[i];
                        var name            = user_list[keys[i]].name;
                        var image           = user_list[keys[i]].image;
                        var notification    = user_list[keys[i]].notifications;
                        var badge = '.';
                        if (notification != undefined && parseInt(notification) > 0) {
                            badge = '<span class="badge">'+notification+'</span>';
                        }
                        var selected_style = 'style="background-color:lightgrey;"';
                        if (window.App.messaging.selected_user != id) {
                            selected_style = '';
                        }
                        html += '<div class="contact" '+selected_style+' data-user-id="'+id+'" data-user-name="' + name + '" data-user-image="'+ image + '">' +
                                '<a class="pull-left">' +
                                    '<figure><img class="img-circle img-responsive" alt="" src="'+image+'"></figure>' +
                                '</a>' +
                                '<h5>'+ name +'</h5><small id="user-notification-'+id+'">&nbsp;' + badge + '&nbsp;</small>' +
                            '</div>'
                    }
                    $('.contact-list').html('');
                    $('.contact-list').html(html);
                }

                window.App.messaging.update_messages = function() {

                    window.App.messaging.selected_user = window.App.messaging.selected_user || null;
                    var selected_user = window.App.messaging.selected_user;

                    if (selected_user == undefined || selected_user == null) return;

                    window.App.messaging.user_notification[selected_user] = window.App.messaging.user_notification[selected_user] || 0
                    window.App.messaging.user_notification[selected_user] = 0
                    var notification_badge = $('[id="user-notification-'+selected_user+'"]');
                    if (notification_badge!=undefined && notification_badge.length > 0) {
                        notification_badge.html('&nbsp;.&nbsp;');
                    }

                    var user_data = window.App.messaging.user_list[selected_user];
                    $('#user-image').attr('src', user_data['image']);
                    $('#user-name').html(user_data['name']);

                    $('.messages').html('');
                    $('.messages').attr('data-user-id', selected_user);
                    var html = '';
                    window.App.messaging.message_list[selected_user] = window.App.messaging.message_list[selected_user] || [];
                    var message_list = window.App.messaging.message_list[selected_user];
                    for(var i = 0; i < message_list.length; i++) {
                        var message_obj = message_list[i];
                        var my              = message_obj.my;
                        var message         = message_obj.message;
                        var image           = message_obj.image;
                        var time            = message_obj.time;
                        if (my != undefined && (my==true || my == 'true' || my == 'True')) {
                            whose = 'my';
                        } else {
                            whose = 'friend';
                        }
                        var state_wise_info= '<i class="fa fa-clock-o"></i> ' + time
                        html += '<li class="'+whose+'-message clearfix">' +
                                '<figure class="profile-picture">' +
                                    '<img src="' + image + '" class="img-circle img-responsive" alt="">' +
                                '</figure>' +
                                '<div class="message">' + message + '<div class="time">' + state_wise_info + '</div>'+'</div>' +
                            '</li>';
                    }
                    $('.messages').html(html);
                };

                var update_single_message = function(result) {
                    if (result.messages != undefined && result.messages.length > 0 ) {
                        console.log('[*] ' + result.name + ": " + result.messages[0].message);
                    }
                    window.App.messaging.selected_user = window.App.messaging.selected_user || null;
                    window.App.messaging.user_notification = window.App.messaging.user_notification || {};
                    var selected_user = window.App.messaging.selected_user;
                    if (selected_user == undefined || selected_user == null || selected_user != result.id) {
                        window.App.messaging.user_notification[result.id] = window.App.messaging.user_notification[result.id] || 0
                        window.App.messaging.user_notification[result.id] += 1
                        var notification_badge = $('[id="user-notification-'+result.id+'"]');
                        if (notification_badge!=undefined && notification_badge.length > 0) {
                            notification_badge.html('&nbsp;<span class="badge">' + window.App.messaging.user_notification[result.id] + '</span>&nbsp;');
                        }
                        return;
                    }
                    var message_list = result.messages;
                    var html = '';
                    for(var i = 0; i < message_list.length; i++) {
                        var message_obj = message_list[i];
                        var my              = message_obj.my;
                        var message         = message_obj.message;
                        var image           = message_obj.image;
                        var time            = message_obj.time;
                        if (my != undefined && (my==true || my == 'true' || my == 'True')) {
                            whose = 'my';
                        } else {
                            whose = 'friend';
                        }
                        var state_wise_info= '<i class="fa fa-clock-o"></i> ' + time
                        html += '<li class="'+whose+'-message clearfix">' +
                                '<figure class="profile-picture">' +
                                    '<img src="' + image + '" class="img-circle img-responsive" alt="">' +
                                '</figure>' +
                                '<div class="message">' + message + '<div class="time">' + state_wise_info + '</div>'+'</div>' +
                            '</li>';
                    }
                    $('.messages').append(html);
                };


                var update_message_list = function(result){
                    var messages = result.messages;
                    var user_id = result.id;

                    window.App.messaging.user_list = window.App.messaging.user_list || {};
                    if (!(user_id in window.App.messaging.user_list)) {
                        window.App.messaging.user_list[user_id] = {
                            notifications: result.notifications,
                            image: result.image,
                            name: result.name
                        };
                    }

                    window.App.messaging.message_list = window.App.messaging.message_list || {};
                    window.App.messaging.message_list[user_id] = window.App.messaging.message_list[user_id]|| [];
                    for(var i = 0; i < messages.length; i++) {
                        window.App.messaging.message_list[user_id].push({message:messages[i].message, my:messages[i].my, image:messages[i].image, time: messages[i].time});
                    }
                    update_single_message(result);
                };


                var message_received = function on_message(args) {
                    console.log(args);
                    update_message_list(args[0]);
                }

                window.App.messaging.subscribe = function() {
                     session.subscribe('com.fitrangi.messaging.listener.' + user, message_received).then(
                        function (sub) {
                            console.log('subscribed to topic');
                        },
                        function (err) {
                            console.log('failed to subscribe to topic', err);
                        }
                     );
                }


                window.App.messaging.send = function(message, to_user){
                    session.call('com.fitrangi.messaging.send', [user, to_user, message]).then(
                        function(res){
                            update_message_list(res);
                        },
                        function(err){
                            console.log('Error sending message: ' + err);
                        }
                    );
                };

                window.App.messaging.all = function(initial) {
                    var data = [user];
                    if (initial != undefined && initial != null) {
                        data.push(initial)
                    }
                    session.call('com.fitrangi.messaging.all', data).then(
                        function(res){
                            for(var i = 0; i < res.length; i++) {
                                update_message_list(res[i]);
                                if (window.App.messaging.selected_user == undefined || window.App.messaging.selected_user.length == 0) {
                                    if (i == 0) {
                                        window.App.messaging.selected_user = res[i].id;
                                    }
                                }
                            }
                            window.App.messaging.update_users();
                            window.App.messaging.update_messages();
                        },
                        function(err){
                            console.log('Error: ' + err)
                        }
                    );
                }
                if (window.App.messaging.on_chat!=undefined && window.App.messaging.on_chat) {

                    if (window.App.messaging.initial_user != undefined && window.App.messaging.initial_user.length > 0) {
                        window.App.messaging.all(window.App.messaging.initial_user);
                    } else {
                        window.App.messaging.all();
                    }
                    window.App.messaging.subscribe();
                }
            };

            connection.onclose = function (reason, details) {
                console.log("Connection lost: " + reason);
                if (notification_timer) {
                    clearInterval(notification_timer);
                    notification_timer = null;
                }
            }

            reset_users_messages();
            connection.open();
         };
        if (attr != undefined && attr.length > 0 && attr != 'null') {
            console.log('Connecting to aync server for user [' + attr  + ']');
            connect_async(attr);
        }

});
