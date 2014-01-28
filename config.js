var path = require('path');

var config = {};

config.app = {};

//Configure app
config.app.port = 1234;
config.app.pathwww = path.join(__dirname, '/www');

module.exports = config;