// Importing
const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, "public")));

// Determining who connects
io.on("connection", (socket) => {
  console.log("user connected");

  socket.on("hangmanWord", (word) => {
    io.sockets.emit("hangmanWord", word);
  });

  // https://socket.io/docs/server-api/#Flag-%E2%80%98broadcast%E2%80%99
  // Newly connected users only
  // socket.emit("message", "potato");

  // // Currently connected
  // socket.broadcast.emit(
  //   "message",
  //   "all clients except the one that is connecting"
  // );

  // Receiving guesses
  socket.on("guessedInput", (guessed) => {
    // console.log("Server Received from Main.js: " + guess);
    console.log(guessed);

    // Sending guesses to everyone else
    io.sockets.emit("test", guessed);
  });

  //reset game on reset button pressed
  socket.on("reset", (resetStatus) => {
    console.log(resetStatus);
    io.sockets.emit("reset", resetStatus);
  });

  // io.emit("message", "Hello");

  socket.on("disconnect", () => {
    console.log("disconnected");
  });
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
