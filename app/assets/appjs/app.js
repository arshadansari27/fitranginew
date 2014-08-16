jQuery(document).ready(function($){

	var App = App || {};

	App.log = function(logThis) {
		console.log(logThis);
	};
	/*	
	App.Base64 = {};
	App.Base64._keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
	
	App.Base64._utf8_encode = function(e){
		e=e.replace(/\r\n/g,"\n");var t="";
		for(var n=0;n<e.length;n++){
			var r=e.charCodeAt(n);
			if(r<128){
				t+=String.fromCharCode(r)
			}else if(r>127&&r<2048){
				t+=String.fromCharCode(r>>6|192);
				t+=String.fromCharCode(r&63|128)
			}else{
				t+=String.fromCharCode(r>>12|224);
				t+=String.fromCharCode(r>>6&63|128);
				t+=String.fromCharCode(r&63|128)
			}
		}
		return t;
	};
	App.Base64._utf8_decode = function(e){
		var t="";
		var n=0;var r=c1=c2=0;
		while(n<e.length){
			r=e.charCodeAt(n);
			if(r<128){
				t+=String.fromCharCode(r);n++
			}else if(r>191&&r<224){
				c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2
			}else{
				c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3
			}
		}
		return t;
	};
	App.Base64.encode =  function(e){
		var t="";var n,r,i,s,o,u,a;var f=0;
		e= App.Base64._utf8_encode(e);
		while(f<e.length){
			n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;
			if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}
			t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)
		}
		return t;
	};
	App.Base64.decode = function(e){
		var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");
		while(f<e.length){
			s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));
			u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));
			n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);
			if(u!=64){
				t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)
			}
		}
		t=App.Base64._utf8_decode(t);
		return t;
	};
	*/

	App.post = function(options) {
		$.ajax({
    		type: 'POST',
    		url: options.url,
    		data: JSON.stringify(options.parameters),
    		success: function(data) { 
    			console.log('Generic: ' + JSON.stringify(data));
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
				
				if (status == 'success')
					setTimeout("window.location.reload();", 2000);
				else
					setTimeout("$('.ajax-message').addClass('hide');$('.ajax-message').removeClass('alert-"+ cls +"');$('.alert-message').remove()", 5000);

    		},
    		contentType: "application/json",
    		dataType: 'json'
		});
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

	 
});
