$(document).ready(function(){
	console.log('On Comments.js')
	var App = window.App;

	var postComment = function(options) {
		App.post({
			url: '/comment/' + options.key,
			parameters: {comment: options.comment, key: options.key, reload: options.reload},
    		success: function(message, node) { 
    			console.log('in success callback' + message);
			},
			error: function(message, node) {
    			console.log('in error callback' + message);
    		}
		});
	};

    var postCommentUpdate = function(options) {
		App.post({
			url: '/comment/' + options.key,
			parameters: {comment: options.comment, key: options.key, reload: options.reload},
    		success: function(message, node) {
                var data = '<strong class="pull-left primary-font"><a href="'+ node.slug + '">' + node.name+ '</a></strong>' +
                    '<small class="pull-right text-muted"><span class="glyphicon glyphicon-time"></span>&nbsp;'+node.time+'</small>' +
                    '<br/><li class="ui-state-default"> ' + node.data + '</li><hr/>';
                var elem = $('ul[data-key='+options.key+']');
                elem.html(data + elem.html());
                //elem.prependChild(data);
			},
			error: function(message, node) {
    			console.log('in error callback' + message);
    		}
		});
	};

	$('#comment_form').on('click', '#comment_submit', function(e) {
		e.stopPropagation();
		var $comment = $('#comment_text').val();
		var $key = $('#comment_form').attr('data-key');
		postComment({comment:$comment, key:$key, reload:true});
	});

    $('.comment_form').on('click', '.comment_submit', function(e) {
		e.stopPropagation();
        e.preventDefault();
        var $key = $(this).attr('data-key');
        var $comment = $('#comment_text_' + $key).val();
		postCommentUpdate({comment:$comment, key:$key, reload:false});
	});

});
