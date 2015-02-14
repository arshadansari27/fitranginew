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
                label: 'Sign In',
                cssClass: 'btn-primary',
                action: function (dialogRef) {
                        var $message = $('<div></div>');
                        $message.load('/main/login');
                        dialogRef.setTitle("Sign In / Register");
                        dialogRef.getModalBody().html($message);
                    }
                },
                {
                label: 'Forgot Password',
                cssClass: 'btn-primary',
                action: function (dialogRef) {
                        var $message = $('<div></div>');
                        $message.load('/main/forgot_password');
                        dialogRef.setTitle("Forgot Password");
                        dialogRef.getModalBody().html($message);
                    }
                },
                {
                label: 'Subscribe',
                cssClass: 'btn-success',
                action: function (dialogRef) {
                        var $message = $('<div></div>');
                        $message.load('/main/subscribe');
                        dialogRef.setTitle("Subscribe");
                        dialogRef.getModalBody().html($message);
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
