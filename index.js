var express = require('express')
var cors = require('cors')
var fs = require('fs');
var app = express()
var  login = require('./login.js');
const http = require('http').Server(app);

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

var loopLimit = 0;
const port = process.env.PORT || 3000;

app.use(cors())

app.use('/login', login);
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
