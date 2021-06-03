var express = require('express')
var cors = require('cors')
var fs = require('fs');
var app = express()
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
app.get('/', (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.sendFile(__dirname + '/index.html');
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});

// Chatroom

io.on('connection', (socket) => {
 
var numUsers = 0;
var clients = {};
  
  socket.on('chat message', msg => {
    io.emit('chat message', msg);
  });
  
    socket.on('add user', user => {
      var userString = JSON.parse(user);
    io.emit('user joined',userString);
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

});
