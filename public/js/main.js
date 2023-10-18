
//To run the app cmd -> npm run dev


const socket = io();
const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages'); 
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

///get username and room from the url
const {username , room} = Qs.parse(location.search,{
    ignoreQueryPrefix:true
});
console.log(`User name is ${username} and the room is ${room}`);

//Join the chatroom
socket.emit('joinRoom',{username,room});

//get room users
socket.on('roomUsers',({room,users})=>{
    outputRoomName(room);
    outputUsers(users);
})

//message from the server.js
socket.on('message',message =>{
    console.log(message);
    //output message to dom or client side
    outputMessage(message);
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

chatForm.addEventListener('submit',(e) => {
    e.preventDefault();
    const msg = e.target.elements.msg.value;

    //emit the message to the server
    socket.emit('chatMessage',msg);
    //clear the input value to nothing
    e.target.elements.msg.value = '';
});

function outputMessage(message)
{
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class = "text">
    ${message.text}
    </p>`
    document.querySelector('.chat-messages').appendChild(div);
}

function outputRoomName(room){
    roomName.innerText = room ;
}
function outputUsers(users){
    userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;

}
document.getElementById('leave-btn').addEventListener('click', () => {
    const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
    if (leaveRoom) {
      window.location = '../index.html';
    } else {
    }
  });