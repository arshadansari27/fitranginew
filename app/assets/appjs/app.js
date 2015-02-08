jQuery(document).ready(function($){

	var App = App || {};

	App.log = function(logThis) {
		console.log(logThis);
	};

	App.post = function(options) {
		$.ajax({
    		type: 'POST',
    		url: options.url,
    		data: JSON.stringify(options.parameters),
    		success: function(data) { 
    			var message = data.message;
    			var node = data.node;
    			var status = data.status;
    			var cls = null;
    			if (status == 'success') {
    				options.success(message, node);
    				cls = 'success';
				}
				else {
    				cls = 'danger';
					options.error(message, node);
				}
				$('.ajax-message').addClass('alert-' + cls);
				$('.ajax-message').removeClass('hide');
				$('.ajax-message').append('<div id="alert-message">' + message + "</div>");

                if (options.reload) {
                    if (status == 'success')
                        setTimeout("window.location.reload();", 2000);
                    else
                        setTimeout("$('.ajax-message').addClass('hide');$('.ajax-message').removeClass('alert-" + cls + "');$('.alert-message').remove()", 5000);
                }

    		},
    		contentType: "application/json",
    		dataType: 'json'
		});
	};

    App.typeahead = function(){
    };

	window.App = App;
 
	loadJS = function(src) {
		if (src.length == 0) return;
    	var jsLink = $("<script type='text/javascript' src='/assets/appjs/"+src+"'>");
     	$("#footer-scripts").append(jsLink); 
 	}; 

	loadJS('logout.js');

 	var $script_names = $('#script_name').html();
 	if ($script_names == undefined || $script_names.length == 0) return;
 	
 	var $scripts = $script_names.split(',')
 	for(var $i = 0; $i < $scripts.length; $i++) {
		var val = $.trim($scripts[$i]);
		loadJS(val);
	}

    App.substringMatcher = function(strs) {
        return function findMatches(q, cb) {
            var matches, substrRegex;
            matches = [];
            substrRegex = new RegExp(q, 'i');
            $.each(strs, function(i, str) {
                if (substrRegex.test(str)) {
                    matches.push({ value: str });
                }
            });
            cb(matches);
        };
    };

	 
});
