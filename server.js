const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
var parseurl = require('parseurl');
const router = express.Router();
const app =	express();
let sess;

app.use(session({
  secret: 'sdfsdSDFD5sf4rt4egrt4drgsdFSD4e5',
  saveUninitialized: true,
  resave: false,
  cookie: { maxAge: new Date(Date.now() + (60 * 1000 * 30)) },
  maxAge: new Date(Date.now() + 5/*(60 * 1000 * 1)*/)
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/views'));
app.use(function (req, res, next) {
  if (!req.session.views) {
    req.session.views = {}
  }

  var pathname = parseurl(req).pathname;

  req.session.views[pathname] = (req.session.views[pathname] || 0) + 1;

  next();
})

router.get('/', (req, res) => {
  if (!sess)
    sess = req.session;

  if (sess.email) {
		return res.redirect('/admin');
  }
  
	res.sendFile('index.html');
});

router.post('/login', (req, res) => {
  if (!sess)
    sess = req.session;
  sess.email = req.body.email;
  sess.token = 'ciuebrcyihuebrybreycbriecbiyeurcbieurcnbkjrenbcer';
	res.end('done');
});

router.get('/admin', (req, res) => {
  if (!sess)
    sess = req.session;
  console.log(sess)
	if (sess.email) {
    res.write(`<h1>Hello ${sess.email}</h1><br>`);
    res.write(`<h1>Token: ${sess.token}</h1><br>`);
    res.write('<a href=' + '/logout' + '>Logout</a><br>');
    res.end('you viewed this page ' + req.session.views['/admin'] + ' times');
	}
	else {
		res.write('<h1>Please login first.</h1>');
		res.end('<a href='+'/'+'>Login</a>');
	}
});

router.get('/test', (req, res) => {
  if (!sess)
    sess = req.session;
  console.log(sess)
  if (sess.email) {
    res.write(`<h1>Hello ${sess.email}</h1><br>`);
    res.write(`<h1>Token: ${sess.token}</h1><br>`);
    res.write('<a href=' + '/logout' + '>Logout</a><br>');
    res.end('you viewed this page ' + req.session.views['/test'] + ' times');
  }
  else {
    res.write('<h1>Please login first.</h1>');
    res.end('<a href=' + '/' + '>Login</a>');
  }
});

router.get('/logout', (req, res) => {
	req.session.destroy((err) => {
		if(err) {
			return console.log(err);
    }
    sess = null;
		res.redirect('/');
	});
});

app.use('/', router);

app.listen(process.env.PORT || 4000,() => {
	console.log(`App Started on PORT ${process.env.PORT || 4000}`);
});