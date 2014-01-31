var ApiChat = function () {
	this.path = require('path');
	this.util = require('util');
	this.io = require('socket.io');
	this.sqlite3 = require('sqlite3').verbose();
	this.db = new this.sqlite3.Database(this.path.join(__dirname, '/frogchatdb'));
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
		        self.users.push(data);
		        socket.emit('updatechat-users', data, self.users);
		        socket.broadcast.emit('updatechat-users', self.users);
		  	});
		  	socket.on('update-text-status', function (user) {
		        socket.broadcast.emit('update-status-user', user);
		  	});
		});
	}
}

module.exports = new ApiChat();