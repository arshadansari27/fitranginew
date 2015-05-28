/**
 * Created by arshad on 28/5/15.
 */

var app = angular.module('myApp', []);

app.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
});

function NotificationCtrl($scope) {

    var user = $('body').attr('data-logged-in-as');
    var url = $('body').attr('data-logged-in-url');
    var loc = window.location.href;

    window.App = window.App || {};
    window.App.async = window.App.async || {};

    $scope.public_activity_count = 0;
    $scope.private_activity_count = 0;


    var reset_message_counter = (loc.indexOf('/messaging') > -1)? true: false;
    var reset_stream_counter = (loc.indexOf(url) > -1)? true:false;

    var reset_stream_counter = (window.location.href.indexOf('/') > -1)?true:false;

    var checkNotifications = function() {
        var notification_timer = setInterval(function () {
            window.App.async.call('com.fitrangi.notifications', [user, (reset_stream_counter)?'1':'0', (reset_message_counter)?'1':'0'], function(res){
                $scope.public_activity_count = res.public_activity_count;
                $scope.private_activity_count = res.private_activity_count;
                console.log("Notification counts: " + $scope.public_activity_count + ', ' + $scope.private_activity_count) ;
                $scope.$apply();
            });
        }, 10000);

    };

    $(document).bind("status.async.connection", function(e, status){
        if (status == true) {
            console.log('Starting notification counter...');
            checkNotifications();

        }
    });

}

