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
			var CheckLinkRemovePhoto = function (photo){
				console.log(photo.indexOf('gravatar'));
				if(photo.indexOf('gravatar') < 0){
		    		$('#link-remove-img-profile').css('display','block');
		    		$('#link-remove-img-profile').click(function (){
		    			socket.emit('remove-photo-user');
		    			$('.fc-config').clearQueue().stop().slideToggle("slow");
		    		});
		    	} else {
		    		$('#link-remove-img-profile').unbind();
		    		$('#link-remove-img-profile').css('display','none');
		    	}
			}
			var detectmob = function () { 
				if( navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/Windows Phone/i)){
					return true;
				} else {
				    return false;
				}
			}
			if (localStorage.getItem('textstatus') !== null){
				$('.fc-status input').val(localStorage.getItem('status'));
			}
		    socket.on('connect', function(){
		        user.email = $('.fc-box #fc-email').val();
		        user.name = $('.fc-box #fc-name').val();
		        user.inMobile = detectmob();
		        user.textstatus = $('.fc-status input').val();
		        localStorage.setItem('email', user.email);
		        localStorage.setItem('name', user.name);
		        socket.emit('adduser', user);
		    });
		    socket.on('update-my-user', function (me, users) {
		    	console.log(users);
		        $('.fc-box .fc-login').clearQueue().stop().slideToggle("slow", function (){
		        	$('.fc-photo img').attr('src', me.photouser);
		        	CheckLinkRemovePhoto(me.photouser);
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
		        $('.fc-status .fc-status-ico').click(function (){
		        	$('.fc-icon-status').clearQueue().stop().slideToggle("slow");
		        });
		        $('.fc-icon-status .fc-status-ico').click(function (){
		        	socket.emit('change-status-ico', $(this).attr('status'));
		        	$('.fc-status .fc-status-ico').attr('class','fc-status-ico ' + $(this).attr('status'));
		        	$('.fc-icon-status').clearQueue().stop().slideToggle("slow");
		        });
		        $('.fc-input-photo').change(function (e){
		        	console.log('TARGET: ',e.target.files[0]);
		        	var file = e.target.files[0];
		            var stream = ss.createStream();
		            ss(socket).emit('send-photo', stream, file, user);
		            //ss.createBlobReadStream(file).pipe(stream);
		            var blobStream = ss.createBlobReadStream(file);
					var size = 0;
					var textlink = $('#link-alter-img-profile').text();
					blobStream.on('data', function(chunk) {
						size += chunk.length;
						percent = Math.floor(size / file.size * 100);
						$('#link-alter-img-profile').text(percent + '%');
						if(percent === 100){
							$('.fc-config').clearQueue().stop().slideToggle("slow");
							$('#link-alter-img-profile').text(textlink);
							socket.emit('send-photo-complete');
						}
					});
					blobStream.pipe(stream);
		        });
		    });
			socket.on('updatechat-users', function (users) {
		    	console.log(users);
		    });
			socket.on('update-my-photo', function (user) {
		    	$('.fc-photo img').attr('src', user.photouser);
		    	CheckLinkRemovePhoto(user.photouser);
		    });
		    socket.on('update-photo-user', function (user) {
		    	console.log(user);
		    });
		    socket.on('update-status-user', function (user) {
		    	console.log(user);
		    });
		    socket.on('update-status-ico', function (user) {
		    	console.log('UPDATE ICO', user);
		    });
		});
	}
}