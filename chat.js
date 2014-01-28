var express = require('express');
var io = require('socket.io');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('fbiochat');
var ss = require('socket.io-stream');
var path = require('path');
var config = require(path.join(__dirname, '/config'));

var app = express();
var server = require('http').createServer(app);
var io = io.listen(server);

server.listen(config.app.port);
console.log('Chat run in port ', config.app.port)

//Public web
app.get('/', function(req, res){
  res.sendfile(path.join(config.app.pathwww, '/index.html'));
});
app.get('/css/*', function(req, res){
  res.sendfile(path.join(config.app.pathwww, '/css/', req.params[0]));
});
app.get('/js/*', function(req, res){
  res.sendfile(path.join(config.app.pathwww, '/js/', req.params[0]));
});
