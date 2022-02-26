import socket from "socket.io";
import { createServer } from "http";
import { createReadStream } from "fs";
import { join } from "path";

const server = createServer((req, res) => {
  const indexPath = join(__dirname, "index.html");
  const readStream = createReadStream(indexPath);

  readStream.pipe(res);
});

const io = socket(server);
let counter = 0;
const msg = { message: "New client connected!", name: "Server" };

io.on("connection", (client) => {
  let clientName = client.id;

  counter += 1;
  client.broadcast.emit("count-change", counter);
  client.emit("count-change", counter);

  client.broadcast.emit("server-msg", msg);
  client.emit("server-msg", msg);

  client.on("client-msg", (data) => {
    const serverData = {
      message: data.message,
      name: clientName,
    };

    client.broadcast.emit("server-msg", serverData);
    client.emit("server-msg", serverData);
  });
});

server.listen(5555);
