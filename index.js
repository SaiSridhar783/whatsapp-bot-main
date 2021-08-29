//const { create, Client } = require("@open-wa/wa-automate");
const msgHandler = require("./msgHndlr");
const options = require("./options");
const wa = require("@open-wa/wa-automate");

const express = require("express");
const path = require("path");
const app = express();
const cors = require("cors");

const start = async (client = new wa.Client()) => {
  console.log("[SERVER] Server Started!");
  // Force it to keep the current session
  //console.log(client)
  client.onStateChanged((state) => {
    console.log("[Client State]", state);
    if (state === "CONFLICT" || state === "UNLAUNCHED") client.forceRefocus();
  });
  // listening on message
  client.onAnyMessage(async (message) => {
    msgHandler(client, message);
    client.getAmountOfLoadedMessages().then((msg) => {
      if (msg >= 2000) {
        client.cutMsgCache();
      }
    });
  });
};

app.use(cors());
app.use(express.static(path.join(__dirname, "static", "venus")));
app.use(express.static(path.join(__dirname, "static", "venus", "dist")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "static", "venus", "index.html"));
});

wa.create(options(true, start))
  .then((client) => start(client))
  .catch((error) => {
    console.log(error);
  });

app.listen(process.env.PORT || 5010);


