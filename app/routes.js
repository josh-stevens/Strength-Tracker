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

  app.get('/api/db', isLoggedIn, function(req, res) {
    connection.query("SELECT * FROM workouts WHERE uid=? ORDER BY day;", req.user.id, function(err, rows) {

      // Build our response to be digestible by d3

      var load = {};

      for (var i = 0; i < rows.length; i++) {

        // Grab load for each set, only if it exists
        if (rows[i].set1_reps !== null && rows[i].set1_weight !== null) {
          var set1 = rows[i].set1_reps * rows[i].set1_weight;
        } else  {
          var set1 = 0;
        }

        if (rows[i].set2_reps !== null && rows[i].set2_weight !== null) {
          var set2 = rows[i].set2_reps * rows[i].set2_weight;
        } 
        else {
          var set2 = 0;
        }

        if (rows[i].set3_reps !== null && rows[i].set3_weight !== null) {
          var set3 = rows[i].set3_reps * rows[i].set3_weight;
        } else {
          var set3 = 0;
        }

        if (rows[i].set4_reps !== null && rows[i].set4_weight !== null) {
          var set4 = rows[i].set4_reps * rows[i].set4_weight;
        } 
        else {
          var set4 = 0;
        }

        if (rows[i].set5_reps !== null && rows[i].set5_weight !== null) {
          var set5 = rows[i].set5_reps * rows[i].set5_weight;
        } 
        else {
          var set5 = 0;
        }

        var day = rows[i].day;

        // Set key in load object to equal the date part of the day string, then calculate the total load
        // and set it as the value of that key

        load[day.toString().slice(4,15)] = set1+set2+set3+set4+set5;
      }
      res.send(load);
    });
  });

  app.post('/api/db', isLoggedIn, function(req, res) {
    // For some reason the data is coming back as a stringified key in the body object....
    // So parse the key
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