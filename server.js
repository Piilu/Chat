const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const dotenv = require('dotenv')
const router = require("./router");
const { all } = require('express/lib/application');
dotenv.config();
const port = process.env.SERVER_PORT;
app.use('/', router);
app.use('/static', express.static("static"));


var allusers = {};
var users = [];
io.on("connection", (socket) => {
  socket.on("send_message", function (data) {
    io.emit('send_message_send',data);
  });
  socket.on("join_room",function(data){
    allusers[data.name] = socket.id;
    users.push(data.name)
    console.log(data.name,'joined')
    io.emit('join_room_send',users);
    io.emit('join_room_send_notify',data.name);


    socket.on('disconnect',function(){
      console.log(data.name,"disconnected")
      delete allusers[data.name];
      users.splice(users.indexOf(data.name),1)
      io.emit('disconnect_send',users);

    })
  })
});

server.listen(port, () => {
  console.log('Server is running on port', port);
});