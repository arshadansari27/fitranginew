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
    wsuri = (document.location.protocol === "http:" ? "ws:" : "wss:") + "//" + loc + "/ws";
}


window.App = window.App || {};
window.App.async = window.App.async || {};

var connection = new autobahn.Connection({
    url: wsuri,
    realm: "realm1"
});


connection.onclose = function (reason, details) {
    console.log("Connection lost: " + reason);
};

connection.onopen = function (session, details) {
    console.log('On open called');
    window.App = window.App || {};
    window.App.async = window.App.async || {};
    window.App.async.call = function(service_name, params, callback) {
        console.log('Calling remote: ' + service_name);
        session.call(service_name, params).then(callback, function (err) { console.log('Error ['+serviceName+']: ('+JSON.stringify(params)+'): ' + JSON.stringify(err));});
    };
    console.log('Set up call complete');
    window.App.async.subscribe = function(service_name, handler) {
        console.log('Subscribing to ' + service_name);
        session.subscribe(service_name, handler).then(function(sub){console.log('Successfully subscribed: ' + service_name);}, function(err){console.log('Cannot subscribe to queue: ' + err);});
    };
    console.log('Set up subscribe complete');

    console.log('Connected');
    $(document).trigger('status.async.connection',[true]);
};

$(document).ready(function(){
    connection.open();
});
