const express = require("express");
const app = express();
const http = require("http").createServer(app);
const hbs = require("hbs");
const path = require("path");
const staticpath = path.join(__dirname, "../public");
const viewpath = path.join(__dirname, "../templetes/view");
const userrouter = require("../router/userrouter");

http.listen(3000, () => {
  console.log("server running on port 3000");
});

app.set("view engine", "hbs");
app.set("views", viewpath);
app.use(express.static(staticpath));
const io = require("socket.io")(http);

const users = {};
io.on("connection", (socket) => {
  socket.on("new-user-joined", (name) => {
    users[socket.id] = name;
    socket.broadcast.emit("user-joined", name);
  });
  socket.on("send", (message) => {
    socket.broadcast.emit("receive", {
      message: message,
      name: users[socket.id],
    });
  });
  socket.on("disconnect", (message) => {
    socket.broadcast.emit("userleft", {
      name: users[socket.id],
    });
  });
});
app.use("/", userrouter);
