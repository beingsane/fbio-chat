window.onload = function (){
	if (typeof(jQuery) !== "function") {
		alert('jQuery is not installed or initialized!');
	} else {
		$('.fbio-chat-box #fbio-chat-email').keyup(function (e){
			if (e.which == 13) {
				$('.fbio-chat-box #fbio-chat-name').focus();
			} else {
				if ($('.fbio-chat-box #fbio-chat-email').val().length) {
					if (!$('.fbio-chat-login-focus').is(':visible')) {
						$('.fbio-chat-login-focus').clearQueue().stop().slideToggle("slow");
					}
				} else {
					if ($('.fbio-chat-login-focus').is(':visible')) {
						$('.fbio-chat-login-focus').clearQueue().stop().slideToggle("slow");
					}
				}
			}
		});
		$('.fbio-chat-box #fbio-chat-name').keyup(function (e){
			if (e.which == 13) {
				$('.fbio-chat-box button').click();
			}
		});
		$('.fbio-chat-box button').click(function (){
			var socket = io.connect();
		    socket.on('connect', function(){
		        var user = {};
		        user.email = $('.fbio-chat-box #fbio-chat-email').val();
		        user.name = $('.fbio-chat-box #fbio-chat-name').val();
		        socket.emit('adduser', user);
		    });
		    socket.on('updatechat-users', function (users) {
		        $('.fbio-chat-box').empty();
		    });
		});
	}
}