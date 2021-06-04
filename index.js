var express = require('express')
var cors = require('cors')
var fs = require('fs');
var app = express()
const http = require('http').Server(app);
var passport = require('passport');
var LichessStrategy = require('passport-lichess').Strategy;

var whitelist = ['https://learnmyskills.com', 'https://www.learnmyskills.com','http://www.learnmyskills.com','http://learnmyskills.com']
const io = require('socket.io')(http,{
  cors: {
    origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
    methods: ["GET", "POST"]
  }
});


passport.use(new LichessStrategy({
    clientID: "ckS0HR27DBrgPQo6",
    clientSecret: "hil6cT0hbPTIbevd1mXlFNfOfFBYhPMK",
    callbackURL: "https://puzzlebattles.herokuapp.com/auth/lichess/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ lichessId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

app.get('/auth/lichess',
  passport.authenticate('lichess'));
 
app.get('/auth/lichess/callback',
  passport.authenticate('lichess', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });



var loopLimit = 0;
const port = process.env.PORT || 3000;

app.use(cors())
app.get('/', (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.sendFile(__dirname + '/index.html');
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
var users = [];
// Chatroom

io.on('connection', (socket) => {
  socket.on('chat message', msg => {
    io.emit('chat message', msg);
  });
  
    socket.on('add user', user => {
      if (!userExists(users,user)) { 
     users.push(user);
     }   
    io.emit('user joined',users);
  });
  
  socket.on('user left', user => {
       if ( removeItemFromArray(users,user)) { 
      io.emit('user left',users);
     }    
});

    socket.on('user reload', user => {
     io.emit('user joined',users);    
});

  
function removeItemFromArray(array, n) {
    const index = array.indexOf(n);

    // if the element is in the array, remove it
    if(index > -1) {

        // remove item
        array.splice(index, 1);
    }
    return array;
}
  
  function userExists(array, n) {
    const index = array.indexOf(n);

    // if the element is in the array, remove it
    if(index > -1) {

       return true 
    }
    return false;
}

});
