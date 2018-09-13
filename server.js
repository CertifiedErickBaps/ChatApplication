var express = require('express')
var http = require('http')
var app = express()
var server = http.Server(app)
var socketio = require('socket.io')(server)
var users = []
 
app.get('/', function (req, res) {
  res.sendFile(__dirname + "/index.html");
})
 
app.get('/styles/index.css', function (req, res) {
  res.sendFile(__dirname + "/styles/index.css");
})

server.listen(3000, function() {
    console.log("Project running at port 3000");
})

socketio.on("connection", function(socket) {
  var name = "";
  socket.on("has connected", function(username) {
    name = username;
    users.push(username);
    socketio.emit("has connected", {username: username, usersList: users});
  });

  socket.on("disconnect", function() {
    users.splice(users.indexOf(name), 1);
    socketio.emit("has disconnected", {username: name, usersList: users});
  });

  socket.on("new message", function(data) {
    socketio.emit("new message", data);
  });
});