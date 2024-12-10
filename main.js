//Generate unique id
const VocaKeys = [
    { word: "merhaba", res: "Merhaba , nasılsınız ? " },
    { word: "selam", res: "Selamm, nasılsın ?" },
    { word: "nasilsin", res: "İyiyim sen nasılsın ?" },
    { word: "saat", res: "gettime" },
    { word: "zaman", res: "gettime" },
    {
      word: "yardım",
      res: "Hemen yardım edeyim. Sorununuzu yalın bir şekilde açıklarmısınz.Örneğin saat kaç ?",
    },
  ];
  var obj = VocaKeys;
  function voca(word) {
    for (let i = 0; i < obj.length; i++) {
      if (obj[i].word === word) {
        return obj[i].res;
      }
    }
    return "Anlamadım tekrar edermisiniz lütfen.";
  }
  
function qID (){
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function simplyf(text){
    return text.replace(/\s+/g, '').toLowerCase();
}
var text = "Merhaba ben çok iyiyim. Sen nasılsın ?";
var converted = text.replace(/\s+/g, '').toLowerCase();
console.log(converted);
const express = require("express");
const webserver = express();
webserver.listen(3000, () => console.log(`Listening on port 3000`));
webserver.get("/", (req, res) => {
  res.sendFile("index.html", { root: __dirname });
});
webserver.get("/style.css", (req, res) => {
  res.sendFile("style.css", { root: __dirname });
});

const { WebSocketServer } = require("ws");

const sockserver = new WebSocketServer({ port: 443 });
sockserver.on("connection", (ws) => {
    
    if (!ws.clientId) { //assign client id
      ws.clientId = qID();
      console.log(`Client connected : ${ws.clientId}`);
    }
    //data from clients
    ws.on("message", function incoming(message) {
      console.log("Gelen mesaj: %s", message);
  
      const data = JSON.parse(message);
  
      if (data.action === "get_uid") {
  
        ws.send(JSON.stringify({ action: "set_uid", username: ws.clientId }));
      }
      if (data.action === "send_message") {
        var chatbot =  voca(simplyf(data.message))
        sockserver.clients.forEach((client) => {
          client.send(
            JSON.stringify({
              action: "receive_message",
              message: data.message,
              chatbot: chatbot,
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