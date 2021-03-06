const { create, Client } = require("@open-wa/wa-automate");
const msgHandler = require("./msgHndlr");
const options = require("./options");

const start = async (client = new Client()) => {
  console.log("[SERVER] Server Started!");
  // Force it to keep the current session
  client.onStateChanged((state) => {
    console.log("[Client State]", state);
    if (state === "CONFLICT" || state === "UNLAUNCHED") client.forceRefocus();
  });
  // listening on message
  client.onAnyMessage(async (message) => {
    client.getAmountOfLoadedMessages().then((msg) => {
      if (msg >= 3000) {
        client.cutMsgCache();
      }
    });
    msgHandler(client, message);
  });

  // client.onAddedToGroup((chat) => {
  //   let totalMem = chat.groupMetadata.participants.length;
  //   if (totalMem < 10) {
  //     client
  //       .sendText(
  //         chat.id,
  //         `Cih member nya cuma ${totalMem}, Kalo mau invite bot, minimal jumlah mem ada 30`
  //       )
  //       .then(() => client.leaveGroup(chat.id))
  //       .then(() => client.deleteChat(chat.id));
  //   } else {
  //     client.sendText(
  //       chat.groupMetadata.id,
  //       `Halo warga grup *${chat.contact.name}* terimakasih sudah menginvite bot ini, untuk melihat menu silahkan kirim *!help*`
  //     );
  //   }
  // });

  /*client.onAck((x => {
            const { from, to, ack } = x
            if (x !== 3) client.sendSeen(to)
        }))*/
};

create(options(true, start))
  .then((client) => start(client))
  .catch((error) => console.log(error));
