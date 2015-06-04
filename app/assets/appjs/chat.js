/**
 * Created by arshad on 27/5/15.
 */


function scrollBottom() {
    setTimeout(function(){
        $(".chat-messages").animate({ scrollTop: $('.chat-messages')[0].scrollHeight}, 100);
    }, 1000);
}

function qs(key) {
    key = key.replace(/[*+?^$.\[\]{}()|\\\/]/g, "\\$&"); // escape RegEx meta chars
    var match = location.search.match(new RegExp("[?&]"+key+"=([^&]+)(&|$)"));
    return match && decodeURIComponent(match[1].replace(/\+/g, " "));
}

function ChatCtrl($scope, $rootScope){

    window.App = window.App || {};
    window.App.async = window.App.async || {};


    $scope.txt_message = '';
    var user = $('body').attr('data-logged-in-as');
    var initial = qs('load-user');

    console.log('User ['+user+'] and initial['+initial+'] ');

    $scope.selectUser = function(_user){
        console.log('selecting user;' +_user);
        if($scope.messages.length == 0)  {
            console.log('No messages yet');
            return;
        }
        for(var i = 0; i < $scope.messages.length; i++) {
            if ($scope.messages[i].id == _user) {
                $scope.messages[i].notifications = '';
                $scope.selected_user = $scope.messages[i];
                break;
            }
        }
        scrollBottom();
        $scope.mark_as_read();
    };

    var onMessage = function(args){
        var res = args[0];
        if (res == undefined || res.length == 0) {
            console.log("Invalid response: " + res);
            return;
        }
        var response_message = res.messages;
        var response_user = res.id;
        var response_notif = res.notifications + "";
        if ($scope.messages == undefined) {
            $scope.messages = [res];
        } else {
            console.log(JSON.stringify(res));
            var found = false;
            for (var i = 0; i < $scope.messages.length; i++) {
                if ($scope.messages[i].id != response_user) {
                    continue;
                }
                for (var k = 0; k < response_message.length; k++) {
                    $scope.messages[i].messages.push(response_message[k]);
                }
                if ($scope.selected_user.id != response_user) {
                    var notif = $scope.messages[i].notifications;
                    if (notif == undefined || notif == null || notif.length == 0) notif = '0';
                    if (response_notif.length > 0) {
                        $scope.messages[i].notifications = parseInt(notif) + parseInt(response_notif);
                    }
                } else {
                    $scope.messages[i].notifications = '';
                }
                found = true;
                break;
            }

            if (!found) {
                $scope.messages.push({
                    id: res.id,
                    name: res.name,
                    notifications: response_notif,
                    image: res.image,
                    messages: res.messages
                });
            }
        }
        $scope.messages = sort($scope.messages);
        $scope.$apply();
        scrollBottom();
    };

    $scope.reload_all = function() {
        console.log('Loading all...:' + Object.keys(window.App.async));

        window.App.async.call('com.fitrangi.messaging.all', [user, initial], function(res){
            console.log('All response: ' + res.length);
            $scope.messages = sort(res);
            $scope.selectUser($scope.messages[0].id);
            $scope.$apply();
        });
    };

    $scope.mark_as_read = function() {

        window.App.async.call('com.fitrangi.messaging.mark-read', [user, $scope.selected_user.id], function(res) {
            console.log('Marking read...')
            $('.contact-list-element').css('background-color', 'white');
            $('#contact-' + $scope.selected_user.id).css('background-color', 'lightgreen');
            console.log('Marked read...')
        });
    };

    $scope.listen_for_new_messages = function(){
        var user_topic = 'com.fitrangi.messaging.listener.' + user;
        console.log('Initiating listen on ' + user_topic);
        window.App.async.subscribe(user_topic, onMessage);
        console.log('Started listening on ' + user_topic);
    };

    $scope.send_message = function() {
            console.log('Sending message: ' + $scope.txt_message);
            if ($scope.txt_message == undefined || $scope.txt_message.length == 0 || $scope.selected_user == undefined) return;
            var mesg = $scope.txt_message;
            if (mesg == undefined || mesg.length == 0) {
                console.log('Cannot send empty...');
                return;
            }
            var selected_user = $scope.selected_user;
            window.App.async.call('com.fitrangi.messaging.send', [user, $scope.selected_user.id, mesg], function(res) {
                    if (res == undefined || res.length == 0) {
                        console.log("Invalid response: " + res);
                        return;
                    }
                    var response_message = res.messages;
                    var response_user = res.id;
                    var response_notif = res.notifications;
                    if (response_user != selected_user.id && response_user != user) {
                        console.log("Invalid response, does not match with selected_user: " + res);
                        return;
                    }
                    if ($scope.messages == undefined) {
                        $scope.messages = [res];
                    } else {
                        for (var i = 0; i < $scope.messages.length; i++) {
                            if ($scope.messages[i].id != selected_user.id && $scope.messages[i].id != user) {
                                continue;
                            }
                            for (var k = 0; k < response_message.length; k++) {
                                $scope.messages[i].messages.push(response_message[k]);
                            }
                            $scope.messages[i].notifications = response_notif;
                            break;
                        }
                    }
                    $scope.txt_message = '';
                    $scope.$apply();
                    scrollBottom();
            });
    };

    $(document).bind("status.async.connection", function(e, status){
        // subscribers can be namespaced with multiple classes
        //subscribers = $('.subscriber.networkDetection');
        // publish notify.networkDetection even to subscribers
        //subscribers.trigger("notify.networkDetection", [status])
        if (status == true) {
            $scope.reload_all();
            $scope.listen_for_new_messages();
        }
    });


}

function sort(resultset) {
    for(var i=0;i<resultset.length;i++)  {
        for(var j=i + 1; j<resultset.length; j++) {
            var i_notification = resultset[i].notifications;
            var j_notification = resultset[j].notifications;
            if (i_notification== undefined || i_notification== null || i_notification.length == 0) i_notification = '0';
            if (j_notification== undefined || j_notification== null || j_notification.length == 0) j_notification = '0';
            if (parseInt(i_notification) < parseInt(j_notification)){
                var temp = resultset[i];
                resultset[i] = resultset[j];
                resultset[j] = temp;
            }
        }
    }
    return resultset;
}
