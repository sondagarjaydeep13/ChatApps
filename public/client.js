const socket = io();

const form = document.getElementById("send-container");
const messageInp = document.getElementById("messageInp");
const messageContainer = document.querySelector(".container");
do {
  var name = prompt("Enter your name to join:");
} while (name == "");
var audio = new Audio("audio/tune.mp3");

const append = (message, position) => {
  const messageElement = document.createElement("div");
  const nameElement = document.createElement("span");
  const textNode = document.createTextNode(message);
  //   nameElement.innerText = name;
  messageElement.classList.add("message");
  messageElement.classList.add(position);
  //   nameElement.classList.add("name");
  messageElement.appendChild(nameElement);
  messageElement.appendChild(textNode);
  messageContainer.append(messageElement);
  if (position == "right") {
    audio.play();
  }
};
// event listener
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = messageInp.value;
  append(`You:${message}`, "right");
  socket.emit("send", message);
  messageInp.value = "";
});

socket.emit("new-user-joined", name);

socket.on("user-joined", (name) => {
  append(`${name} joined the chat`, "left");
});
socket.on("receive", (data) => {
  append(`${data.name}:${data.message}`, "left");
});
socket.on("userleft", (data) => {
  append(`${data.name} left chat`, "left");
});
