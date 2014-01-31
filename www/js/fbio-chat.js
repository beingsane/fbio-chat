window.onload = function (){
	if (typeof(jQuery) !== "function") {
		alert('jQuery is not installed or initialized!');
	} else {
		if(localStorage.getItem('email') !== null){
			$('.fc-box #fc-email').val(localStorage.getItem('email'));
		    $('.fc-box #fc-name').val(localStorage.getItem('name'));
		    $('.fc-login-focus').clearQueue().stop().slideToggle("slow");
		}
		$('.fc-box #fc-email').keyup(function (e){
			if (e.which == 13) {
				$('.fc-box #fc-name').focus();
			} else {
				if ($('.fc-box #fc-email').val().length) {
					if (!$('.fc-login-focus').is(':visible')) {
						$('.fc-login-focus').clearQueue().stop().slideToggle("slow");
					}
				} else {
					if ($('.fc-login-focus').is(':visible')) {
						$('.fc-login-focus').clearQueue().stop().slideToggle("slow");
					}
				}
			}
		});
		$('.fc-box #fc-name').keyup(function (e){
			if (e.which == 13) {
				$('.fc-box button').click();
			}
		});
		$('.fc-box button').click(function (){
			var user = {};
			var socket = io.connect();
			var UpdateMyTextStatus = function (textstatus){
				user.textstatus = textstatus;
				socket.emit('update-text-status', user);
				localStorage.setItem('textstatus', status);
			}
			if (localStorage.getItem('textstatus') !== null){
				$('.fc-status input').val(localStorage.getItem('status'));
			}
		    socket.on('connect', function(){
		        user.email = $('.fc-box #fc-email').val();
		        user.name = $('.fc-box #fc-name').val();
		        user.textstatus = $('.fc-status input').val();
		        localStorage.setItem('email', user.email);
		        localStorage.setItem('name', user.name);
		        socket.emit('adduser', user);
		    });
		    socket.on('updatechat-users', function (me, users) {
		    	console.log(users);
		        $('.fc-box .fc-login').clearQueue().stop().slideToggle("slow", function (){
		        	$('.fc-photo img').attr('src','http://gravatar.com/avatar/'+me.emailmd5);
		        	$('.fc-title').text(me.name);
		        	$('.fc-status input').click(function (){
		        		$(this).removeAttr('readonly');
		        		$(this).focus();
						var tmpStr = $(this).val();
						$(this).val('');
						$(this).val(tmpStr);
						$(this).blur(function (){
							UpdateMyTextStatus($(this).val());
							$(this).attr('readonly','readonly');
						});
						$(this).keyup(function (e){
							if (e.which == 13) {
								UpdateMyTextStatus($(this).val());
								$(this).attr('readonly','readonly');
							}
						});
		        	});

		        	$('.fc-box .fc-loged').clearQueue().stop().slideToggle("slow");
		        });
		        $('.fc-ico-config').click(function (){
		        	$('.fc-config').clearQueue().stop().slideToggle("slow");
		        });
		        $('#link-alter-img-profile').click(function (){
		        	$('.fc-input-photo').trigger('click');
   					return false;
		        });
		        $('.fc-input-photo').change(function (){
		        	console.log('Alter photo...');
		        });
		    });
		    socket.on('update-status-user', function (user) {
		    	console.log(user);
		    });
		});
	}
}