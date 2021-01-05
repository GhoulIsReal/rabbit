import MicroMQ from "micromq";
const WebSocket = require("ws");
import env from "../../env";

const notifications = new MicroMQ({
  name: "notifications",
  rabbit: {
    url: env.rabbit_url,
  },
});

const ws = new WebSocket.Server({
  port: process.env.PORT,
});

const clients = new Map();

ws.on("connection", (connection) => {
  connection.on("message", (message) => {
    const { event, data } = JSON.parse(message);
    if (event === "authorize" && data.userID) {
      clients.set(data.userID, connection);
    }
  });
});

ws.on("connection", (connection) => {
  connection.on("disconnect", clients.clear(connection.userID));
});

notifications.action("notify", (meta) => {
  if (!meta.userID || !meta.text) {
    return [400, { error: "Bad data" }];
  }

  const connection = clients.get(meta.userId);

  if (!connection) {
    return [404, { error: "User not found" }];
  }

  connection.send(meta.text);

  return { ok: true };
});
