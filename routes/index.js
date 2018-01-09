var express = require('express');
var router = express.Router();
var passport = require('passport');
 
function authenticationMiddleware () {  
  return function (req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
    res.redirect('/login?fail=true')
  }
}


router.get('/login', function(req, res){
  if(req.query.fail)
    res.render('login', { message: 'Usuário e/ou senha incorretos!' });
  else
    res.render('login', { message: null });
});
 
router.post('/login',
  passport.authenticate('local', { successRedirect: '/chat', failureRedirect: '/login?fail=true' })
);

router.get('/', function(req, res, next) {
  res.render('login', {message: null});
});

router.get('/chat', authenticationMiddleware (), function(req, res){
   res.render('chat', { username: req.user.username });
});

module.exports = router;
