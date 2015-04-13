/**
 * Created by arshad on 14/04/15.
 */
jQuery(document).ready(function ($) {

    var App = window.App;
    $(".show_login").click(function (e) {
        e.stopPropagation();
        App.show_login();
    });
    $(".show_signup").click(function (e) {
        e.stopPropagation();
        App.show_registration();
    });

    $('body').on('click', '[data-action="add-discussion"]', function (e) {
        e.stopPropagation();
        if ($(this).attr('data-user-id').length > 0) {
            window.location.href = "/write/discussion";
        } else {
            App.show_login();
        }
    });
    $('body').on('click', '[data-action="add-article"]', function (e) {
        e.stopPropagation();
        if ($(this).attr('data-user-id').length > 0) {
            window.location.href = "/write/article";
        } else {
            App.show_login();
        }
    });
    $('body').on('click', '[data-action="edit-discussion"]', function (e) {
        e.stopPropagation();
        if ($(this).attr('data-user-id').length > 0) {
            window.location.href = "/write/discussion/" + $(this).attr('data-model-id');
        } else {
            App.show_login();
        }
    });
    $('body').on('click', '[data-action="edit-article"]', function (e) {
        e.stopPropagation();
        if ($(this).attr('data-user-id').length > 0) {
            window.location.href = "/write/article/" + $(this).attr('data-model-id');
        } else {
            App.show_login();
        }
    });
    $('body').on('click', '[data-action="publish-article"]', function (e) {
        e.stopPropagation();
        e.preventDefault();
        App.content.publish($(this).attr('data-model-id'), 'article', function (data) {
            BootstrapDialog.alert(data.message);
            if (data.status == 'success') {
                window.location.reload();
            }
        });
    });

    $('body').on('click', '[data-action="unpublish-article"]', function (e) {
        e.stopPropagation();
        e.preventDefault();
        App.content.unpublish($(this).attr('data-model-id'), 'article', function (data) {
            BootstrapDialog.alert(data.message);
            if (data.status == 'success') {
                window.location.reload();
            }
        });
    });


    $('body').on('click', '[data-action="add-adventure-wishlist"]', function (e) {
        e.stopPropagation();
        e.preventDefault();
        var user = $(this).attr('data-user-id');
        var model = $(this).attr('data-model-id');
        App.profile.add_adventure_to_wish_list(user, model);
    });
    $('body').on('click', '[data-action="remove-adventure-wishlist"]', function (e) {
        e.stopPropagation();
        e.preventDefault();
        var user = $(this).attr('data-user-id');
        var model = $(this).attr('data-model-id');
        App.profile.remove_adventure_from_wish_list(user, model);
    });
    $('body').on('click', '[data-action="add-adventure-accomplished"]', function (e) {
        e.stopPropagation();
        e.preventDefault();
        var user = $(this).attr('data-user-id');
        var model = $(this).attr('data-model-id');
        App.profile.add_adventure_to_done(user, model);
    });
    $('body').on('click', '[data-action="remove-adventure-accomplished"]', function (e) {
        e.stopPropagation();
        e.preventDefault();
        var user = $(this).attr('data-user-id');
        var model = $(this).attr('data-model-id');
        App.profile.remove_adventure_from_done(user, model);
    });
    $('body').on('click', '[data-action="add-activity-favorite"]', function (e) {
        e.stopPropagation();
        e.preventDefault();
        var user = $(this).attr('data-user-id');
        var model = $(this).attr('data-model-id');
        App.profile.add_activity_to_favorite(user, model);
    });
    $('body').on('click', '[data-action="remove-activity-favorite"]', function (e) {
        e.stopPropagation();
        e.preventDefault();
        var user = $(this).attr('data-user-id');
        var model = $(this).attr('data-model-id');
        App.profile.remove_activity_from_favorite(user, model);
    });
    $('body').on('click', '[data-action="follow-profile"]', function (e) {

        e.stopPropagation();
        e.preventDefault();
        var user = $(this).attr('data-user-id');
        var model = $(this).attr('data-model-id');
        App.profile.add_profile_to_follow(user, model);
    });
    $('body').on('click', '[data-action="unfollow-profile"]', function (e) {
        e.stopPropagation();
        e.preventDefault();
        var user = $(this).attr('data-user-id');
        var model = $(this).attr('data-model-id');
        App.profile.remove_profile_from_follow(user, model);
    });

    $('body').on('click', '[data-action="delete-article"]', function (e) {
        e.stopPropagation();
        e.preventDefault();
        BootstrapDialog.confirm("Are you sure you want to delete", function (ip) {
            if (ip == true) {
                App.content.delete($(this).attr('data-model-id'), 'article', function (data) {
                    BootstrapDialog.alert(data.message);
                    if (data.status == 'success') {
                        if (window.location.href.search('write/') == 0) {
                            window.history.back();
                        } else {
                            window.location.reload();
                        }
                    }
                });
            }
        });
    });
    $('.show_subscribe').click(function () {
        subscription_modal_text = '<div><div id="subscribe-form"><input type="text" id="subscription-name" class="form-control" placeholder="Name" required="Please Enter Your Name"><br/><input type="email" id="subscription-email" class="form-control" placeholder="email" required="Please Enter Your Email">' + '</div>' + '<div id="subscribe-message"></div>' + '</div>';
        console.log(subscription_modal_text);
        BootstrapDialog.show({
            title: 'Subscribe For Latest Fitrangi Updates!',
            message: subscription_modal_text,
            buttons: [
                {
                    label: 'Close',
                    action: function (dialogRef) {
                        dialogRef.close()
                    }
                },
                {
                    label: 'Subscribe',
                    cssClass: 'btn-primary',
                    action: function (dialogRef) {
                        var subscription_name = $('#subscription-name').val();
                        var subscription_email = $('#subscription-email').val();
                        console.log('Subscribing: ' + subscription_name + ", " + subscription_email);
                        $.ajax({
                            type: 'POST',
                            url: '/subscribe',
                            data: {
                                name: subscription_name,
                                email: subscription_email
                            }
                        }).done(function (msg) {
                            $('#subscribe-message').html(msg.message);
                            $('#subscribe-message').addClass('alert');
                            if (msg.status == 'success') {
                                $('#subscribe-form').hide();
                                $('#subscribe-message').addClass('alert-success');
                                $('#subscribe-message').show();

                            } else {
                                $('#subscribe-message').addClass('alert-error');
                                $('#subscribe-message').show();
                            }
                        });
                    }
                }
            ]
        });
    });

    if ($('.summernote') != undefined) {
        $('.summernote').summernote({height: 400});
    }
    function postToFeed(title, desc, url, image) {
        var obj = {method: 'feed', link: 'http://www.fitrangi.com' + url, picture: 'http://www.fitrangi.com/' + image, name: title, description: desc};

        function callback(response) {
        }

        FB.ui(obj, callback);
    }

    $('.btnFbShare').click(function (e) {
        e.stopPropagation();
        e.preventDefault();
        elem = $(this);
        postToFeed(elem.data('title'), elem.data('desc'), elem.data('href'), elem.data('image'));
        return false;
    });

    var App = window.App;
    if (window.App.doFilter != undefined && window.App.doFilter.length != undefined) {
        for (var i = 0; i < window.App.doFilter.length; i++) {
            window.App.doFilter[i]();
        }
    }
});
