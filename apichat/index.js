var ApiChat = function () {
	this.path = require('path');
	this.util = require('util');
	this.io = require('socket.io');
	this.sqlite3 = require('sqlite3').verbose();
	this.db = new this.sqlite3.Database(this.path.join(__dirname, '/frogchatdb'));
	this.ss = require('socket.io-stream');
}

ApiChat.prototype = {
	init: function (server){
		this.io = this.io.listen(server);
		this.io.sockets.on('connection', function (socket) {
			socket.emit('news', { hello: 'world' });
		  	socket.on('my other event', function (data) {
		    	console.log(data);
		  	});
		});

		this.io.of('/apichat').on('connection', function(socket) {
			ss(socket).on('profile-image', function(stream, data) {
		    	var filename = path.basename(data.name);
		    	stream.pipe(fs.createWriteStream(filename));
		  	});
		});
	}
}

module.exports = new ApiChat();