var ApiChat = function () {
	this.path = require('path');
	this.fs = require('fs');
	this.io = require('socket.io');
	this.sqlite3 = require('sqlite3').verbose();
	this.db = new this.sqlite3.Database(this.path.join(__dirname, '/frogchatdb'));
	this.routeapi = '/apichat/get-photo';
	this.ss = require('socket.io-stream');
	this.md5 = require('MD5');

	this.users = [];
}

ApiChat.prototype = {
	init: function (server){
		var self = this;
		self.io = this.io.listen(server);
		self.io.sockets.on('connection', function (socket) {
		  	socket.on('adduser', function (data) {
		  		data.emailmd5 = self.md5(data.email);
		    	socket.username = data.email;
		    	data.photouser = self.getPhotoUser(data.emailmd5);
		        self.users.push(data);
		        socket.emit('update-my-user', data, self.users);
		        socket.broadcast.emit('updatechat-users', self.users);
		  	});
		  	socket.on('update-text-status', function (user) {
		        socket.broadcast.emit('update-status-user', user);
		  	});
		  	self.ss(socket).on('send-photo', function(stream, data, user) {
		  		console.log('LOGCHAT: ', data);
		  		if (data !== null) {
		  			var extention = self.getExtension(self.path.basename(data.name));
			        if(self.findPhotoUser(self.md5(user.email)) !== ""){
			        	self.removePhotoUser(self.md5(user.email));
			        }
			        var filename = self.path.join(__dirname, '/photo-users/') + self.md5(user.email) + extention;
			        stream.pipe(self.fs.createWriteStream(filename));
		  		}
		    });
		    socket.on('send-photo-complete', function () {
		        var user = {};
		        user.email = socket.username;
		        user.emailmd5 = self.md5(user.email);
		    	user.photouser = self.getPhotoUser(user.emailmd5);
		    	socket.emit('update-my-photo', user);
		        socket.broadcast.emit('update-photo-user', user);
		  	});
		  	socket.on('remove-photo-user', function () {
		        var user = {};
		        user.email = socket.username;
		        user.emailmd5 = self.md5(user.email);
		        if(self.findPhotoUser(user.emailmd5) !== ""){
		        	self.removePhotoUser(user.emailmd5);
		        	user.photouser = self.getPhotoUser(user.emailmd5);
			    	socket.emit('update-my-photo', user);
			        socket.broadcast.emit('update-photo-user', user);
		        }
		  	});
		  	socket.on('change-status-ico', function (status) {
		        var user = {};
		        user.email = socket.username;
		        user.emailmd5 = self.md5(user.email);
		        user.statusico = status;
		        socket.broadcast.emit('update-status-ico', user);
		  	});
		});
	},
	getExtension: function(filename) {
	    var ext = this.path.extname(filename||'').split('.');
	    return '.'+ext[ext.length - 1];
	},
	getNameWithoutExtension: function(filename) {
	    var ext = filename.split('.');
	    return ext[0];
	},
	getPhotoUser: function (emailmd5){
		var photo = this.findPhotoUser(emailmd5);
		if (photo === "") {
			photo = "http://gravatar.com/avatar/" + emailmd5;
		} else {
			photo = this.path.join(this.routeapi,photo); 
		}
		return photo;
	},
	findPhotoUser: function (emailmd5){
		var files = this.fs.readdirSync(this.path.join(__dirname, '/photo-users/'));
		var photo = "";
		for(var i in files) {
			if(emailmd5 == this.getNameWithoutExtension(files[i])){
				photo = files[i];
		  	}
		}
		return photo;
	},
	removePhotoUser: function(emailmd5){
		this.fs.unlinkSync(this.path.join(__dirname, '/photo-users/', this.findPhotoUser(emailmd5)));
	},
	getRoute: function (){
		return this.routeapi + '/*';
	},
	restfull: function (req, res){
		res.sendfile(this.path.join(__dirname, '/photo-users/', req.params[0]));
	}
}

module.exports = new ApiChat();