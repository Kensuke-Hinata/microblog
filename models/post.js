var MongoClient = require('mongodb').MongoClient;

function Post(username, post, time) {
  this.username = username;
  this.post = post;
  if (time) {
    this.time = time;
  } else {
    this.time = new Date();
  }
}

Post.prototype.save = function(callback) {
  var post = {
    username: this.username,
    post: this.post,
    time: this.time,
  };
  MongoClient.connect('mongodb://localhost:27017/test', function(err, db) {
    if (err) {
      return callback(err);
    }
    db.collection('posts', function(err, collection) {
      if (err) {
        db.close();
        return callback(err);
      }
      collection.ensureIndex('user');
      collection.insert(post, {safe: true}, function(err, post) {
        db.close();
        callback(err, post);
      });
    });
  });
};

Post.get = function(username, callback) {
  MongoClient.connect('mongodb://localhost:27017/test', function(err, db) {
    if (err) {
      return callback(err);
    }
    db.collection('posts', function(err, collection) {
      if (err) {
        db.close();
        return callback(err);
      }
      var query = {};
      if (username) {
        query.username = username;
      }
      collection.find(query).sort({time: -1}).toArray(function(err, docs) {
        db.close();
        if (err) {
          return callback(err);
        }
        var posts = [];
        docs.forEach(function(doc, index) {
          var post = new Post(doc.username, doc.post, doc.time);
          posts.push(post);
        })
        callback(null, posts);
      });
    });
  });
};

module.exports = Post;
