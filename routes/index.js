var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var User = require('../models/user');
var Post = require('../models/post');

/* GET home page. */
router.get('/', function(req, res) {
  Post.get(null, function(err, posts) {
    if (err) {
      posts = [];
    }
    res.render('index', {
      title: 'Express',
      posts: posts
    });
  })
});

router.get('/hello', function(req, res) {
  res.send('The time is ' + new Date().toString());
});

router.get('/user/:username', function(req, res, next) {
  console.log('hello');
  next();
});

router.get('/user/:username', function(req, res) {
  res.send('Hello ' + req.params.username);
});

router.get('/list', function(req, res) {
  res.render('list', {
    title: 'List',
    items: [1988, 'kensuke', 'express', 'node.js']
  });
});

router.get('/helper', function(req, res) {
  res.render('helper', {
    title: 'Helper',
  });
});

router.get('/login', checkNotLogin);
router.get('/login', function(req, res) {
  console.log('login');
  res.render('login', {
    title: '用戶登入',
  });
});

router.post('/login', checkNotLogin);
router.post('/login', function(req, res) {
  var md5 = crypto.createHash('md5');
  var password = md5.update(req.body.password).digest('base64');
  User.get(req.body.username, function(err, user) {
    if (!user) {
      req.flash('error', '用戶不存在');
      return res.redirect('/login');
    }
    if (user.password !== password) {
      req.flash('error', '用戶口令錯誤');
      return res.redirect('/login');
    }
    req.session.user = user;
    req.flash('success', '登入成功');
    return res.redirect('/');
  });
});

router.get('/register', checkNotLogin);
router.get('/register', function(req, res) {
  res.render('register', {
    title: '用戶註冊'
  });
});

router.post('/register', checkNotLogin);
router.post('/register', function(req, res) {
  console.log('register');
  if (req.body['password'] !== req.body['password-repeat']) {
    req.flash('error', 'password not identical.');
    return res.redirect('/register');
  }
  var md5 = crypto.createHash('md5');
  var password = md5.update(req.body.password).digest('base64');
  var newUser = new User({
    name: req.body.username,
    password: password,
  });
  User.get(newUser.name, function(err, user) {
    if (user) {
      err = 'Username already exists.';
    }
    if (err) {
      req.flash('error', err);
      return res.redirect('/register');
    }
    newUser.save(function(err) {
      if (err) {
        req.flash('error', err);
        return res.redirect('/register');
      }
      req.session.user = newUser;
      //req.session.success = 'success';
      req.flash('success', '註冊成功');
      //req.session.flash('success', '註冊成功');
      res.redirect('/');
    })
  })
});

router.get('/logout', checkLogin);
router.get('/logout', function(req, res) {
  req.session.user = null;
  req.flash('success', '登出成功');
  return res.redirect('/');
});

router.post('/post', checkLogin);
router.post('/post', function(req, res) {
  var currentUser = req.session.user;
  var post = new Post(currentUser.name, req.body.post);
  post.save(function(err) {
    if (err) {
      req.flash('error', err);
      return res.redirect('/');
    }
    req.flash('success', '發表微博成功');
    return res.redirect('/u/' + currentUser.name);
  });
});

router.get('/u/:user', function(req, res) {
  User.get(req.params.user, function(err, user) {
    if (!user) {
      req.flash('error', '用戶不存在');
      return res.redirect('/');
    }
    Post.get(user.name, function(err, posts) {
      if (err) {
        req.flash('error', err);
        return res.redirect('/');
      }
      console.log(posts);
      res.render('user', {
        title: user.name,
        posts: posts,
      });
    });
  });
});

function checkLogin(req, res, next) {
  if (!req.session.user) {
    req.flash('error', 'not login');
    return res.redirect('/login');
  }
  next();
}

function checkNotLogin(req, res, next) {
  if (req.session.user) {
    req.flash('error', 'already login');
    return res.redirect('/');
  }
  next();
}

module.exports = router;
