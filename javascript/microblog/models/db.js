var settings = require('../settings');
var mongodb = require('mongodb');
console.log(mongodb);
var Db = require('mongodb').Db;
var Connection = require('mongodb').connect;
//console.log(Connection);
//console.log(Connection.DEFAULT_PORT);
var Server = require('mongodb').Server;

module.exports = new Db(new Server(settings.host, Connection.DEFAULT_PORT, {}));
