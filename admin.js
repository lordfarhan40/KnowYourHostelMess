var passport = require('passport');
var Strategy = require('passport-local').Strategy;
const sha = require('sha256');
const users = require('./models/users.js');
const hostels=require('./models/hostels.js');

// Configure the local strategy for use by Passport.
//
// The local strategy require a `verify` function which receives the credentials
// (`username` and `password`) submitted by the user.  The function must verify
// that the password is correct and then invoke `cb` with a user object, which
// will be set at `req.user` in route handlers after authentication.
passport.use(new Strategy({
    usernameField:'uid',
    passwordField:'password'
  },
  function(uid, password, cb) {
    password=sha(password);
    users.getUserById(uid, function(err, user) {
      if (err) { return cb(err); }
      if (!user) { return cb(null, false); }
      if (user.password != password) { return cb(null, false); }
      return cb(null, user);
    });
}));


// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  The
// typical implementation of this is as simple as supplying the user ID when
// serializing, and querying the user record by ID from the database when
// deserializing.
passport.serializeUser(function(user, cb) {
  cb(null, user.uid);
});

passport.deserializeUser(function(uid, cb) {
  users.getUserById(uid,(err,user)=>
  {
    if(err||user===undefined){
      return cb("There was some error");
    }
    cb(undefined,user);
  });
});

function setUpRoutes(app){
  
  //Adding middleware to parse read post attributes and session
  app.use(require('body-parser').urlencoded({ extended: true }));
  app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));

  // Initialize Passport and restore authentication state, if any, from the
  // session.
  app.use(passport.initialize());
  app.use(passport.session());

  app.post('/create_user',
  require('connect-ensure-login').ensureLoggedIn('/login'),
  function(req, res){
    if(req.user.is_admin==0){
      res.send("You are not the admin, you cannot create another user");
      return;
    }

    var userDetails={
      uid:req.body.uid,
      password:sha(req.body.password),
      is_admin:req.body.is_admin===undefined?0:1,
      hostel_id:req.body.hostel_id,
      name:req.body.name,
    }
    users.createUser(userDetails,(err,created)=>
    {
      if(!err&&created==true)
      {
        res.send("The user got inserted!");
      }else
      {
       console.log(err);
        res.send("The user insertion failed!");
      }
    });
  });

  app.get('/create_user',
  require('connect-ensure-login').ensureLoggedIn('/login'),
  function(req, res){
    if(req.user.is_admin==0){
      console.log('You are not the admin!.');
      return;
    }
    hostels.getHostelsList((err,hostels)=>
    {
      res.render('createUser.hbs',{hostels});
    })
  });

  app.get('/create_hostel',
  require('connect-ensure-login').ensureLoggedIn('/login'),
  function(req, res){
    console.log('Admin Status in database: ', req.user.is_admin);
    if(req.user.is_admin==0){
      res.send("You are not the admin!.");
      return;
    }
    hostels.getHostelsList((err,hostels)=>
    {
      res.render('createHostel.hbs');
    })
  });

  app.post('/create_hostel',
  require('connect-ensure-login').ensureLoggedIn('/login'),
  function(req, res){
    if(req.user.is_admin==0){
      res.send("You are not the admin!.");
      return;
    }
    var hostelDetails={
      name:req.body.name,
      description:req.body.description
    };
    hostels.createHostel(hostelDetails,(err,isSuccess)=>
    {
      if(!err&&isSuccess==true)
      {
        res.redirect("/");
      }else
      {
        console.log(err);
        res.send("Error occured");
      }
    });
  });


  app.get('/login',
  function(req, res){
    console.log(req.user);
    res.render('LoginPage.hbs');
  });

  //Takes in uid and password as post paramenters to login
  app.post('/login', 
  passport.authenticate('local',{ failureRedirect: '/login' }),
  function(req, res) {
    res.redirect("/");
  });

  app.get('/logout',
  function(req, res){
    req.logout();
    res.redirect('/');
  });

  app.get('/EditProfile',
  require('connect-ensure-login').ensureLoggedIn('/login'),
  (req, res) => {
    res.render('EditProfile', {user: req.user});
  });

  app.get('/EditHostel',
  require('connect-ensure-login').ensureLoggedIn('/login'),
  (req, res) => {
    var hid=req.query.hid;
    console.log(hid);
    hostels.getHostelById(hid,(err,hostelDetails)=>
    {
      res.render('EditHostel', {user: req.user,hostelDetails});
    });
    
  });

  app.post('/EditHostel',
  require('connect-ensure-login').ensureLoggedIn('/login'),
  (req, res) => {
    var name=req.body.name;
    var description=req.body.description;
    console.log(name);
    console.log(description);
    var image=req.files.image;
    var hid=req.body.hid;
    require('fs').unlink(__dirname +'/public/images/hostels/'+hid+'.jpg',(err)=>
    {
      image.mv(__dirname +'/public/images/hostels/'+hid+'.jpg',(err)=>
      {
        if(err)
        {
          console.log(err);
          return res.send("Error");
        }else{
          return res.redirect("/");
        }
      });
    });
  });

}

module.exports={
    setUpRoutes
}