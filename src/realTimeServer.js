const io = require("socket.io")(server);
const users = {};

io.on("connection", (socket) => {
  console.log("Usuario conectado");

  // Recibe el nombre del usuario cuando se conecta
  socket.on("register-user", (username) => {
    users[socket.id] = username;
    io.emit("users-list", Object.values(users));
  });

  socket.on("message", (message) => {
    const user = users[socket.id] || "Anónimo";
    io.emit("message", { user, message });
  });

  socket.on("disconnect", () => {
    delete users[socket.id];
    io.emit("users-list", Object.values(users));
    io.emit("message", {
      user: "Sistema",
      message: "Un usuario se ha desconectado",
    });
  });
});
