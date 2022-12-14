const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");

const socket = io();

//get username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

//join chat room
socket.emit("joinChatRoom", { username, room });

//message from server
socket.on("message", (message) => {
  console.log(message);

  outputMessage(message);

  //auto scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

//message submit
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  //get message text
  let msg = e.target.elements.msg.value;

  //emit a message to the server
  socket.emit("chatMessage", msg);

  //clear input form
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

//output message to DOM
function outputMessage(message) {
  let div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">${message.username}<span>${message.time}</span></p>
	<p class="text">
		${message.text}
	</p>`;
  document.querySelector(".chat-messages").appendChild(div);
}
