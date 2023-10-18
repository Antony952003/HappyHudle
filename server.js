const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {userJoin,getCurrentUser,userLeave,getRoomUsers} = require('./utils/users');
const app = express();
const server = http.createServer(app);
const io = socketio(server);
app.use(express.static(path.join(__dirname,'public')));
const botname = 'Happy Huddle bot';
io.on('connection',socket =>{
    socket.on('joinRoom',({username,room}) => {
        const user = userJoin(socket.id, username, room);
        socket.join(user.room);

 
        socket.emit('message',formatMessage(botname,'Welcome to Happy Huddle!!'));
    // broadcast to all the clients when connects
    socket.broadcast.to(user.room).emit('message',formatMessage(botname,`${user.username} has joined the chat`));
    io.to(user.room).emit('roomUsers',{
        room:user.room,
        users:getRoomUsers(user.room)
    });
    })

    //Listen for the chat Message 
    socket.on('chatMessage',(msg)=>{
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message',formatMessage(user.username ,msg));
    });
    socket.on('disconnect',()=>{
        const user = userLeave(socket.id);
        if(user){
            io.to(user.room).emit('message',formatMessage(botname,`${user.username} has left the chat`));

            io.to(user.room).emit('roomUsers',{
                room:user.room,
                users:getRoomUsers(user.room)
            });
        }
        // emit the message on  disconnection to all the client of the server.
    });
});
const PORT = 3000;
server.listen(PORT,() => console.log(`server is running on port ${PORT}`));