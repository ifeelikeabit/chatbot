const express = require("express");
const { WebSocketServer } = require("ws");
clientUsername = "none";
let text =
  '{ "users": [' +
  '{  "name": "esat", "password": "Esat_123"},' +
  '{  "name": "mehmet", "password": "Mehmet_123"},' +
  '{  "name": "john", "password": "John_123"}]}';

const obj = JSON.parse(text);

function validate(username, password) {
  for (let i = 0; i < obj.users.length; i++) {
    if (obj.users[i].name === username && obj.users[i].password === password) {
      console.log("pair");
      return true;
    }
  }
  console.log("unpair");
  return false;
}

// Express server settings and initilize
const webserver = express();
webserver.use(express.urlencoded({ extended: true }));


//Routes START

webserver.get("/login", (req, res) => {
  res.sendFile("login.html", { root: __dirname });
});


webserver.post("/login", (req, res) => {
  if (!validate(req.body.username, req.body.password))
  {
    res.sendFile("wrong.html", { root: __dirname });
    return
  }

  clientUsername = req.body.username;
  res.sendFile("mainclient.html", { root: __dirname });
});
// webserver
//   .use((req, res) => {
//     switch (req.url) {
//       case "/client1":
//         res.sendFile("client1.html", { root: __dirname });
//         break;
//       case "/client2":
//         res.sendFile("client2.html", { root: __dirname });
//         break;
//       case "/client3":
//         res.sendFile("client3.html", { root: __dirname });
//         break;
//       case "/client4":
//         res.sendFile("client4.html", { root: __dirname });
//         break;
//       default:
//         res.status(404).send("Page not found");
//         break;
//     }
//   })
  webserver.listen(3000, () => console.log(`Listening on port 3000`));
//Routes END

//WebSocket server
const sockserver = new WebSocketServer({ port: 443 });


//When the connection is up
sockserver.on("connection", (ws) => {
  if (!ws.clientId) { //assign client id
    ws.clientId = clientUsername;
    console.log(`Client id defined : ${ws.clientId}`);
  }
  //data from clients
  ws.on("message", function incoming(message) {
    console.log("Gelen mesaj: %s", message);

    const data = JSON.parse(message);

    if (data.action === "get_username") {

      ws.send(JSON.stringify({ action: "set_username", username: clientUsername }));
    }
    if (data.action === "send_message") {
      sockserver.clients.forEach((client) => {
        client.send(
          JSON.stringify({
            action: "receive_message",
            message: data.message,
            sender: data.sender
          })
        );
      });
    }
  });


  ws.on("close", () => {
    console.log(`Client ${ws.clientId} has disconnected!`);
  });

  ws.onerror = function () {
    console.log("WebSocket error");
  };
});
