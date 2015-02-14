/**
 * Created by arshad on 14/02/15.
 */
$(document).ready(function(){
	console.log('On main.js');

	var App = window.App;


    $("#btn-login").click(function(e) {
        e.stopPropagation();
        BootstrapDialog.show({
            title: "Sign In / Register",
            message: function(dialog) {
                var $message = $('<div></div>');
                $message.load('/main/login');
                return $message;
            },
            buttons: [{
                id: 'btn-sign-in',
                label: 'Sign In',
                cssClass: 'btn-link',
                action: function (dialogRef) {
                        var $message = $('<div></div>');
                        $message.load('/main/login');
                        dialogRef.setTitle("Sign In / Register");
                        dialogRef.getModalBody().html($message);
                        $('#btn-sign-in').hide();
                        $('#btn-subscribe').show();
                        $('#btn-forgot-password').show();
                    }
                },
                {
                id: 'btn-forgot-password',
                label: 'Forgot Password',
                cssClass: 'btn-link',
                action: function (dialogRef) {
                        var $message = $('<div></div>');
                        $message.load('/main/forgot_password');
                        dialogRef.setTitle("Forgot Password");
                        dialogRef.getModalBody().html($message);
                        $('#btn-sign-in').show();
                        $('#btn-subscribe').show();
                        $('#btn-forgot-password').hide();
                    }
                },
                {
                id: 'btn-subscribe',
                label: 'Subscribe',
                cssClass: 'btn-link',
                action: function (dialogRef) {
                        var $message = $('<div></div>');
                        $message.load('/main/subscribe');
                        dialogRef.setTitle("Subscribe");
                        dialogRef.getModalBody().html($message);
                        $('#btn-sign-in').show();
                        $('#btn-forgot-password').hide();
                        $('#btn-subscribe').hide();
                    }
                },
                {
                label: 'Close',
                action: function (dialogRef) {
                    dialogRef.close();
                }
            }]
        });
    });
});
