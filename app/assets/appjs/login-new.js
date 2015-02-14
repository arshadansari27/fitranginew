jQuery(document).ready(function($){
	console.log('From login.js');

	var App = window.App;

    function statusChangeCallback(response) {
            if (response.status === 'connected') {
                testAPI();
            } else if (response.status === 'not_authorized') {
                document.getElementById('status').innerHTML = 'Please log into this app.';
            } else {
                document.getElementById('status').innerHTML = 'Please log into Facebook.';
            }
    }

    function checkLoginState() {
        FB.getLoginStatus(function(response) {
            statusChangeCallback(response);
        });
    }

    window.fbAsyncInit = function() {
        FB.init({
                appId      : '526533334116117',
                cookie     : true,  // enable cookies to allow the server to access
                xfbml      : true,  // parse social plugins on this page
                version    : 'v2.1' // use version 2.1
        });

        FB.getLoginStatus(function(response) {
                statusChangeCallback(response);
        });
    };

    (function(d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s); js.id = id;
            js.src = "http://connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

    function testAPI() {
        FB.api('/me', function(response) {
                $.ajax({
                    type: 'POST',
                    url: '/sociallogin',
                    data: {name: response.name, email: response.email}
                }).done(function(msg) {
                    if (msg.status == 'success') {
                        window.location = msg.location;
                    } else {
                        alert("Invalid Login, try again");
                    }
                });
        }, {scope: 'email, user_likes'});
    }

    function make_base_auth(data) {
        var hash = btoa(data);
        return "Basic " + hash;
    }

    function onSignInCallback(resp) {
        console.log(resp);
        if (!resp.status.signed_in) {
                return;
        }
        var data = atob(resp.id_token.split('.')[1]);
        console.log(data);
        $.ajax({
                type: 'GET',
                url: 'https://www.googleapis.com/plus/v1/people/me?key=AIzaSyC2G0kvBLJBEnBCUPf053z6mL5tgbWON5o',
                dataType: 'json',
                async: false,
                headers: {
                    "Authorization": "Bearer " + resp['access_token']
                }
        }).done(function (data) {
                var primaryEmail;
                for (var i=0; i < data.emails.length; i++) {
                    if (data.emails[i].type === 'account') primaryEmail = data.emails[i].value;
                }
                var email = primaryEmail;
                var name = data['displayName'];
                console.log("Google Login: " + name + ", " + email);
                $.ajax({
                    type: 'POST',
                    url: '/sociallogin',
                    data: {name: name, email: email}
                }).done(function(msg) {
                    if (msg.status == 'success') {
                        window.location = msg.location;
                    } else {
                        alert("Invalid Login, try again");
                }
            });
        });

    }


	var signin = $("#loginbox")
	var registration = $("#signupbox")

	$(signin).on('click', '#btn-login', function(e) {
		e.stopPropagation();
		console.log('logging in');
		var username = $('#username').val();
		var password = $('#password').val();
		var rememberme = $('#login-remember:checked').val();
		rememberme = (rememberme === 1)? true: false;
		loginUser({
			username: username, 
			password:password, 
			remember:rememberme
		});
		return false;
	});

	$(registration).on('click', '#btn-signup', function(e) {
		e.stopPropagation();
		$('.alert').hide();
		$('.alert').removeClass('error');
		$('.alert').empty();
		console.log('registering');
		var name = $('#signup-name').val();
		var email = $('#signup-email').val();
		var password = $('#signup-password').val();
		var pconfirm = $('#signup-confirm').val();
		console.log(name + ',' + email + ',' + password + ',' + pconfirm);
		if (validate_registration({name:name, email:email, password:password, pconfirm:pconfirm})) {
			registerUser({name:name, email:email, password:password});
		}


	});
	var registerUser = function(options) {
		var name = options.name;
		var email = options.email;
		var password = options.password;
		App.post({
			url: '/register',
			parameters: {name: name, email: email, password:password},
    		success: function(message, node) { 
    			console.log('in success callback' + message);
			},
			error: function(message, node) {
    			console.log('in error callback' + message);
    		}
		});

	}

	var validate_registration = function(config) {
		var name = config.name;
		var email = config.email;
		var password = config.password;
		var pconfirm  = config.pconfirm;
		var message = '';
		if (name == '')
			message += 'Name cannot be empty<br/>';
		if (email == '' || email.indexOf("@") <= 0 || email.indexOf(".") <= 0)
			message += 'Invalid email provided<br/>';
		if (password !== pconfirm) 
			message += 'Password do not match<br/>';
		if (password == '') 
			message += 'Password is empty<br/>';
		if (message != '') {
			$('.alert').append(message);
			$('.alert').addClass('error');
			$('.alert').show();
			return false;
		} else {
			return true;
		}
	}
	
	$('#signinlink').on('click', function(e) {
		e.stopPropagation();
		$('#signupbox').hide();
		$('#loginbox').show();
	});

	$('#signupshow').on('click', function(e) {
		e.stopPropagation();
		$('#loginbox').hide();
		$('#signupbox').show();
	});

	var loginUser = function(options) {
		var uname = options.username;
		var passwd = options.password;
		var remember = options.remember;
		$.ajax({
    		type: 'POST',
    		url: '/login',
    		data: JSON.stringify({email: uname, password: passwd}),
    		success: function(data) { 
    			var message = data.message;
    			var node = data.node;
    			var status = data.status;
    			if (status == 'success') {
    				window.location.href = '/';
				}
				else {
					$('.alert').append(message);
					$('.alert').addClass('error');
					$('.alert').show();

				}
    		},
    		contentType: "application/json",
    		dataType: 'json'
		});
	};

});
