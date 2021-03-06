//var mongodb = require('./db');
var MongoClient = require('mongodb').MongoClient;

function User(user) {
  this.name = user.name;
  this.password = user.password;
};

User.prototype.save = function(callback) {
  var user = {
    name: this.name,
    password: this.password,
  };
  MongoClient.connect('mongodb://127.0.0.1:27017/test', function(err, db) {
  //mongodb.open(function(err, db) {
    if (err) {
      return callback(err);
    }
    db.collection('users', function(err, collection) {
      if (err) {
        //mongodb.close();
        db.close();
        return callback(err);
      }
      collection.ensureIndex('name', {unique: true});
      collection.insert(user, {safe: true}, function(err, user) {
        //mongodb.close();
        db.close();
        callback(err, user);
      });
    });
  });
};

User.get = function(username, callback) {
  //mongodb.open(function(err, db) {
  MongoClient.connect('mongodb://localhost:27017/test', function(err, db) {
    if (err) {
      return callback(err);
    }
    db.collection('users', function(err, collection) {
      if (err) {
        //mongodb.close();
        return callback(err);
      }
      collection.findOne({name: username}, function(err, doc) {
        //mongodb.close();
        if (doc) {
          var user = new User(doc);
          callback(err, user);
        } else {
          callback(err, null);
        }
      });
    });
  });
};

module.exports = User;
