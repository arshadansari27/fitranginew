/**
 * Created by arshad on 09/04/15.
 */

jQuery(document).ready(function($){

	var App = App || {};

	App.log = function(logThis) {
		console.log(logThis);
	};

	App.editor = function(options) {

        var callback = null;
        if (arguments.length > 1) {
            callback = arguments[1]
        }
        $('#loadingImage').show();
		$.ajax({
    		type: 'POST',
    		url: '/editors/invoke',
    		data: JSON.stringify(options),
    		success: function(data) {
                if (data.status=='error' && data.message == 'Please login before making requests'){
                    App.show_login();
                }
                console.log(data);
    		    if (callback != null){
                    callback(data);
                } else {
                    setTimeout(function() {
                        window.location.reload();
                    }, 1000);
                }
    		},
    		contentType: "application/json",
    		dataType: 'json'
		});
	};

    App.filter = function(id) {
        var input = $('#'+id);
        var category = input.attr('data-category');
        if (category == null || category == undefined || category.length == 0) category = 'all';
        var model = input.attr('data-model');
        //var filters = model + '-' + category;
        var filters = model;

        window.filters = window.filters || {};
        window.filters[filters] = window.filters[filters] || [];

        var filters_list = window.filters[filters];
        console.log('Adding filter for [' + model + '] [' + category + ']: ' + id);
        filters_list.push(id);

    };


	window.App = App;
});
