
        function convertImgToBase64(url, callback, outputFormat) {
            var canvas = document.createElement('CANVAS');
            var ctx = canvas.getContext('2d');
            var img = new Image;
            img.crossOrigin = 'Anonymous';
            img.onload = function () {
                canvas.height = img.height;
                canvas.width = img.width;
                ctx.drawImage(img, 0, 0);
                var dataURL = canvas.toDataURL(outputFormat || 'image/png');
                callback.call(this, dataURL);
                // Clean up
                canvas = null;
            };
            img.src = url;
        }
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
                oauth      : true,
                cookie     : true,  // enable cookies to allow the server to access
                xfbml      : true,  // parse social plugins on this page
                version    : 'v2.1' // use version 2.1
            });
            /*FB.getLoginStatus(function(response) {
                //statusChangeCallback(response);
            });*/
        };

        function fb_login(){
            FB.login(function(response) {

                if (response.authResponse) {
                    $('#loadingImage').show();
                    access_token = response.authResponse.accessToken; //get access token
                    user_id = response.authResponse.userID; //get FB UID
                    FB.api('/me',
                            function(response) {
                                var profile_image= "https://graph.facebook.com/"+ response.id +"/picture?type=large";
                                _login_with_data(profile_image, {name: response.name, email: response.email});
                            },
                            {scope: 'email, user_likes'}
                    );
                } else {
                    console.log('User cancelled login or did not fully authorize.');
                }
            }, {
                scope: 'publish_stream,email'
            });
        }

        /*
        (function(d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s); js.id = id;
            js.src = "http://connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
        */
        (function() {
            var e = document.createElement('script');
            e.src = document.location.protocol + '//connect.facebook.net/en_US/all.js';
            e.async = true;
            document.getElementById('fb-root').appendChild(e);
        }());

        var _login_with_data = function(profile_image, response) {
            convertImgToBase64(profile_image, function(base64Img) {
                var _login = function(image) {

                    var data = null;
                    if (image != null) {
                        data = {name: response.name, email: response.email, file: image};
                    } else {
                        data = {name: response.name, email: response.email, file: ''};
                    }
                    $.ajax({
                        type: 'POST',
                        url: '/sociallogin',
                        data: data
                    }).done(function (msg) {
                        if (msg.status == 'success') {
                            if (window.location.href.indexOf("target=") > -1) {
                                var u =  window.location.href;
                                var v = u.split('target=')[1];
                                var w = v.split('&')[0];
                                window.location.href=w;
                            }
                            else {
                                window.location.reload();
                            }
                        } else {
                            $("#message").html('Some went wrong. Please try again later.');
                            $("#error").show();
                        }
                    });

                };
                _login(base64Img);
            });
        }

        function testAPI() {

        }

        function make_base_auth(data) {
            var hash = btoa(data);
            return "Basic " + hash;
        }

        function onSignInCallback(resp) {
            if(!resp['g-oauth-window']){
                return;
            }
            if (!resp.status.signed_in) {
                return;
            }
            var data = atob(resp.id_token.split('.')[1]);
            $('#loadingImage').show();
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
                var image_url = data.image.url;
                var profile_image = image_url.substring(0, image_url.indexOf("?") - 1) + "?sz=200";
                _login_with_data(profile_image, {name: name, email: email});

            });

          }