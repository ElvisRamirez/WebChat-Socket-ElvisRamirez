const socket = io();


const send = document.querySelector("#send-message");
const allMessages = document.querySelector("#all-messages");
const userList = document.querySelector("#user-list");

// Solicita al usuario su nombre
const username = prompt("¿Cuál es tu nombre?");
socket.emit("register-user", username);

// Enviar mensaje
send.addEventListener("click", () => {
  const messageInput = document.querySelector("#message");
  const message = messageInput.value.trim();
  if (message !== "") {
    socket.emit("message", message);
    messageInput.value = "";
  }
});

// Recibir y mostrar mensajes
socket.on("message", ({ user, message }) => {
  const msg = document.createRange().createContextualFragment(`
    <div class="message">
      <div class="image-container">
        <img src="/img/perfil.png" alt="Perfil de ${user}" class="profile-image" />
      </div>
      <div class="message-body">
        <div class="user-info">
          <span class="username">${user}</span>
          <span class="time">Ahora</span>
        </div>
        <p>${message}</p>
      </div>
    </div>
  `);
  allMessages.append(msg);
  allMessages.scrollTop = allMessages.scrollHeight;
});

// Actualizar la lista de usuarios conectados
socket.on("users-list", (users) => {
  userList.innerHTML = "";
  users.forEach((user) => {
    const li = document.createElement("li");
    li.textContent = user;
    userList.appendChild(li);
  });
});
