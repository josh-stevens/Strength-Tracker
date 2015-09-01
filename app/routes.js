module.exports = function(app, passport, connection){
  app.get('/', function(req, res){
    res.render('index.ejs');
  });

  app.get('/login', function(req, res){
    res.render('login.ejs', { message: req.flash('loginMessage') });
  });
  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true
  }));

  app.get('/signup', function(req, res){
    res.render('signup.ejs', { message: req.flash('signupMessage') });
  });


  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/',
    failureRedirect: '/signup',
    failureFlash: true
  }));

  app.get('/profile', isLoggedIn, function(req, res){
    res.render('profile.ejs', { user: req.user });
  });

  app.get('/auth/facebook', passport.authenticate('facebook', {scope: ['email']}));

  app.get('/auth/facebook/callback', 
    passport.authenticate('facebook', { successRedirect: '/profile',
                                        failureRedirect: '/' }));


  app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });

  app.get('/api/db', function(req, res) {

  });

  app.post('/api/db', function(req, res) {
    console.log(req.body);
    for (var key in req.body) {
      var body = JSON.parse(key);
    }
    var uid = body.uid;
    var date = body.date;
    var exercise = body.exercise;

    var weight1 = body.set_1[0], reps1 = body.set_1[1], weight2 = body.set_2[0], reps2 = body.set_2[1],
    weight3 = body.set_3[0], reps3 = body.set_3[1], weight4 = body.set_4[0], reps4 = body.set_4[1],
    weight5 = body.set_5[0], reps5 = body.set_5[1];
    var queryArgs = [uid, date, exercise, weight1, reps1, weight2, reps2, weight3, reps3, weight4, reps4, weight5, reps5];
    console.log(queryArgs);
    connection.query("INSERT INTO workouts (uid, day, exercise, set1_weight, set1_reps, set2_weight, set2_reps, set3_weight, set3_reps, set4_weight, set4_reps, set5_weight, set5_reps) values (?,?,?,?,?,?,?,?,?,?,?,?,?);", queryArgs, function(err, rows) {
      if (err) console.log(err);
      res.send(rows);
    });

  });

};

function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()){
    return next();
  }

  res.redirect('/login');
}