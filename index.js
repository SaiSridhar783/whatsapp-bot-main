//const { create, Client } = require("@open-wa/wa-automate");
const msgHandler = require("./msgHndlr");
const options = require("./options");
const wa = require('@open-wa/wa-automate');

const start = async (client = new wa.Client()) => {
  console.log("[SERVER] Server Started!");
  // Force it to keep the current session
  //console.log(client)
  client.onStateChanged((state) => {
    console.log("[Client State]", state);
    if (state === "CONFLICT" || state === "UNLAUNCHED") client.forceRefocus();
  });
  // listening on message
  client.onMessage(async message => {
	msgHandler(client, message);
    client.getAmountOfLoadedMessages().then((msg) => {
      if (msg >= 2000) {
        client.cutMsgCache();
      }
    });
    
  });

};

wa.create(options(true, start)).then(client => start(client));

//create(options(true, start))
  //.then((client) => start(client))
  //.catch((error) => console.log(error));
