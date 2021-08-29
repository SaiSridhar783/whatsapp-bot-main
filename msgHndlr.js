const { decryptMedia } = require("@open-wa/wa-decrypt");
const fs = require("fs-extra");
const axios = require("axios");
const moment = require("moment-timezone");
const get = require("got");
const color = require("./lib/color");
const { exec } = require("child_process");
const nhentai = require("nhentai-js");
const oneLinerJoke = require("one-liner-joke");
const animeJS = require("@freezegold/anime.js");
const { API } = require("nhentai-api");
const { liriklagu, quotemaker } = require("./lib/functions");
const { help, info, anihelp, nsfwhelp } = require("./lib/help");
const nsfw_ = JSON.parse(fs.readFileSync("./lib/NSFW.json"));
const enabledgrps = JSON.parse(fs.readFileSync("./lib/groups.json"));
const { removeBackgroundFromImageBase64 } = require("remove.bg");

const config = require("./config.json");
const list = require("./lib/inu.json").inu;

moment.tz.setDefault("Asia/Kolkata").locale("id");

module.exports = msgHandler = async (client, message) => {
    try {
        const {
            type,
            id,
            t,
            sender,
            isGroupMsg,
            chat,
            chatId,
            // caption,
            isMedia,
            mimetype,
            quotedMsg,
            quotedMsgObj,
        } = message;
        // const chat = await client.getChatById(chatId);
        if (!sender) return;
        let { body, caption } = message;
        const { name, formattedTitle } = chat;
        let pushname = "";
        pushname = sender.pushname || sender.verifiedName;
        if (pushname == undefined) pushname = config.ownerName;
        if (typeof body === "object" && quotedMsg) body = quotedMsgObj.body;
        if (body && body.startsWith("! ")) body = body[0] + body.slice(2);
        if (caption && caption.startsWith("! "))
            caption = caption[0] + caption.slice(2);
        let commands = caption || body || "";
        let command = commands.toLowerCase().split("\n")[0].split(" ")[0] || "";
        const args = commands.split(" ");

        const msgs = (message) => {
            if (command.startsWith("!")) {
                if (message.length >= 10) {
                    return `${message.substr(0, 15)}`;
                } else {
                    return `${message}`;
                }
            }
        };

        const mess = {
            wait: "Aankh band karke 10 tk gino :3",
            error: {
                St: "[❗] Write *!sticker* either in the caption of an image/gif or reply to an image/gif with the command.",
                Qm: "[❗] Some error occured, maybe the theme is not available!",
                Ki: "[❗] Bot can't remove the group admin!",
                Ad: "[❗] Could not add target, may be it is private",
                Iv: "[❗] Link is invalid!",
                Gp: "[❗] This command is only for groups!",
                Ow: "[❗] This command is only for the bot owner!",
                admin: "[❗] This command can be used by group admins only!",
            },
        };
        const randomanime = require("random-anime");
        const anime = randomanime.anime();
        const nsfwanime = randomanime.nsfw();
        const time = moment(t * 1000).format("DD/MM HH:mm:ss");
        const botNumber = await client.getHostNumber();
        const blockNumber = await client.getBlockedIds();
        if (isGroupMsg && chat.groupMetadata == null) {
            console.log(body);
        }
        const groupId = isGroupMsg ? chat.groupMetadata.id : "";
        const groupAdmins = isGroupMsg ? await client.getGroupAdmins(groupId) : "";
        const isGroupAdmins = isGroupMsg ? groupAdmins.includes(sender.id) : false;
        const isBotGroupAdmins = isGroupMsg
            ? groupAdmins.includes(botNumber + "@c.us")
            : false;
        const isOwner = message.fromMe;
        const isBlocked = blockNumber.includes(sender.id);
        const isNsfw = isGroupMsg ? nsfw_.includes(chat.id) : false;
        const uaOverride =
            "WhatsApp/2.2029.4 Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36";
        const isUrl = new RegExp(
            /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/gi
        );
        if (!isGroupMsg && command.startsWith("!"))
            console.log(
                "\x1b[1;31m~\x1b[1;37m>",
                "[\x1b[1;32mEXEC\x1b[1;37m]",
                time,
                color(msgs(command)),
                "from",
                color(pushname)
            );
        if (isGroupMsg && command.startsWith("!"))
            console.log(
                "\x1b[1;31m~\x1b[1;37m>",
                "[\x1b[1;32mEXEC\x1b[1;37m]",
                time,
                color(msgs(command)),
                "from",
                color(pushname),
                "in",
                color(formattedTitle)
            );
        //if (!isGroupMsg && !command.startsWith('!')) console.log('\x1b[1;33m~\x1b[1;37m>', '[\x1b[1;31mMSG\x1b[1;37m]', time, color(body), 'from', color(pushname))
        //if (isGroupMsg && !command.startsWith('!')) console.log('\x1b[1;33m~\x1b[1;37m>', '[\x1b[1;31mMSG\x1b[1;37m]', time, color(body), 'from', color(pushname), 'in', color(formattedTitle))
        if (isBlocked) return;
        //if (!isOwner) return
        if (
            isGroupMsg &&
            !isOwner &&
            !config.enableInGroups &&
            !enabledgrps.includes(chatId)
        )
            return;
        switch (command) {
            case "!sticker":
            case "!stiker":
            case "!st":
                let metadata = { author: "Nagachika", pack: "Chimichangas" };
                if (args.includes("wname") || args.includes("withname")) {
                    metadata.author = pushname;
                    metadata.pack = pushname;
                }
                if (args.includes("nocrop")) metadata.keepScale = true;
                if (
                    (isMedia && type === "image" && mimetype !== "image/gif") ||
                    (quotedMsg &&
                        quotedMsg.type == "image" &&
                        quotedMsgObj.mimetype !== "image/gif")
                ) {
                    const msg = isMedia ? message : quotedMsg;
                    const mediaData = await decryptMedia(msg, uaOverride);
                    let imageBase64 = `data:${msg.mimetype};base64,${mediaData.toString(
                        "base64"
                    )}`;

                    if (args.includes("nobg")) {
                        let result;
                        try {
                            result = await removeBackgroundFromImageBase64({
                                base64img: imageBase64,
                                apiKey: config.removeBgAPIKey,
                                size: "auto",
                                type: "auto",
                                format: "png",
                            });
                            imageBase64 = `data:image/png;base64,${result.base64img}`;
                        } catch (e) {
                            client.reply(chatId, e[0].title.split(".")[0], id);
                            break;
                        }
                    }

                    client.reply(chatId, "Aankh band karke 10 tak gino :3", id);
                    await client.sendImageAsSticker(chatId, imageBase64, metadata);
                } else if (
                    (isMedia && (mimetype === "video/mp4" || mimetype === "image/gif")) ||
                    (quotedMsgObj &&
                        quotedMsgObj.isMedia &&
                        (quotedMsgObj.mimetype === "video/mp4" ||
                            quotedMsgObj.mimetype === "image/gif"))
                ) {
                    msg = isMedia ? message : quotedMsgObj;
                    const mediaData = await decryptMedia(msg, uaOverride);
                    client.reply(chatId, "Aankh band karke 10 tak gino :3", id);
                    try {
                        await client.sendMp4AsSticker(
                            chatId,
                            mediaData,
                            {
                                crop: false,
                                endTime:
                                    msg.duration >= 10
                                        ? "00:00:10.0"
                                        : `00:00:0${msg.duration}.0`,
                            },
                            metadata
                        );
                    } catch (err) {
                        await client.reply(
                            chatId,
                            err.name === "STICKER_TOO_LARGE"
                                ? "❗ Video too big, try reducing the duration"
                                : "❗ Some error occurred, sorry :(",
                            id
                        );
                    }
                } else if (args[1] && args[1].match(isUrl)) {
                    await client
                        .sendStickerfromUrl(chatId, args[1], { method: "get" })
                        .catch((err) => console.log("Caught exception: ", err));
                } else {
                    client.reply(chatId, mess.error.St, id);
                }
                break;

            case "!texttospeech":
            case "!tts":
                if (args.length === 1)
                    return client.reply(
                        chatId,
                        "Syntax *!tts [en, hi, jp,..] [text]*, try *!tts en Hello*\nwhere en=english, hi=hindi, jp=japanese, etc."
                    );
                const tts = require("node-gtts");
                const dataText = body.slice(8);
                if (dataText === "") return client.reply(chatId, "Didn't get you", id);
                if (dataText.length > 500)
                    return client.reply(chatId, "❗ Text is too long!", id);
                var dataBhs = args[1].toLowerCase();
                try {
                    tts2 = tts(dataBhs);
                    tts2.save("./media/tts/res.mp3", dataText, function () {
                        client.sendPtt(chatId, "./media/tts/res.mp3", id);
                    });
                } catch (err) {
                    console.log(message);
                    return client.reply(chatId, err.message, id);
                }
                break;

            case "!nh":
                //if (isGroupMsg) return client.reply(from, 'Sorry this command for private chat only!', id)
                if (args.length === 2) {
                    const nuklir = body.split(" ")[1];
                    client.reply(chatId, mess.wait, id);
                    const cek = await nhentai.exists(nuklir);
                    if (cek === true) {
                        try {
                            const api = new API();
                            const pic = await api.getBook(nuklir).then((book) => {
                                return api.getImageURL(book.cover);
                            });
                            const dojin = await nhentai.getDoujin(nuklir);
                            const { title, details, link } = dojin;
                            const { parodies, tags, artists, groups, languages, categories } =
                                await details;
                            var teks = `*➸ Title* : ${title}\n\n*➸ Parodies* : ${parodies}\n\n*Tags➸ * : ${tags.join(
                                ", "
                            )}\n\n*➸ Artists* : ${artists.join(
                                ", "
                            )}\n\n*➸ Groups* : ${groups.join(
                                ", "
                            )}\n\n*➸ Languages* : ${languages.join(
                                ", "
                            )}\n\n*➸ Categories* : ${categories}\n\n*➸ Link* : ${link}`;
                            //exec('nhentai --id=' + nuklir + ` -P mantap.pdf -o ./hentong/${nuklir}.pdf --format `+ `${nuklir}.pdf`, (error, stdout, stderr) => {
                            client.sendFileFromUrl(chatId, pic, "hentod.jpg", teks, id);
                        } catch (err) {
                            client.reply(
                                chatId,
                                "❗ Something went wrong, maybe the code is wrong",
                                id
                            );
                        }
                    } else {
                        client.reply(chatId, "❗ Code Incorrect!");
                    }
                } else {
                    client.reply(chatId, "[ WRONG ] Send the command *!nh [code]* ");
                }
                break;

            case "!sauce":
                if (
                    (isMedia && type === "image") ||
                    (quotedMsg && quotedMsg.type === "image")
                ) {
                    if (isMedia) {
                        var mediaData = await decryptMedia(message, uaOverride);
                    } else {
                        var mediaData = await decryptMedia(quotedMsg, uaOverride);
                    }
                    const fetch = require("node-fetch");
                    const imgBS4 = `data:${mimetype};base64,${mediaData.toString(
                        "base64"
                    )}`;
                    client.reply(chatId, "Searching....", id);
                    console.log(mediaData);

                    fetch("https://trace.moe/api/search", {
                        method: "POST",
                        body: JSON.stringify({ image: imgBS4 }),
                        headers: { "Content-Type": "application/json" },
                    })
                        .then((respon) => respon.json())
                        .then((resolt) => {
                            if (resolt.docs && resolt.docs.length <= 0) {
                                client.reply(
                                    chatId,
                                    "❗ Sorry, I don't know what anime is this",
                                    id
                                );
                            }
                            const {
                                is_adult,
                                title,
                                title_chinese,
                                title_romaji,
                                title_english,
                                episode,
                                similarity,
                                filename,
                                at,
                                tokenthumb,
                                anilist_id,
                            } = resolt.docs[0];
                            teks = "";
                            if (similarity < 0.92) {
                                teks = "*I don't have much confidence with this* :\n\n";
                            }
                            teks += `➸ *Title Japanese* : ${title}\n➸ *Title chinese* : ${title_chinese}\n➸ *Title Romaji* : ${title_romaji}\n➸ *Title English* : ${title_english}\n`;
                            teks += `➸ *Ecchi* : ${is_adult}\n`;
                            teks += `➸ *Eps* : ${episode.toString()}\n`;
                            teks += `➸ *Similarity* : ${(similarity * 100).toFixed(1)}%\n`;
                            var video = `https://media.trace.moe/video/${anilist_id}/${encodeURIComponent(
                                filename
                            )}?t=${at}&token=${tokenthumb}`;
                            client
                                .sendFileFromUrl(chatId, video, "nimek.mp4", teks, id)
                                .catch(() => {
                                    client.reply(chatId, teks, id);
                                });
                        })
                        .catch(() => {
                            client.reply(chatId, "Error !", id);
                        });
                } else {
                    client.sendFile(
                        chatId,
                        "./media/img/tutod.jpg",
                        "Tutor.jpg",
                        "❗ Not found!!!",
                        id
                    );
                }
                break;

            case "!saucenao":
                /* if (
                    (isMedia && type === "image") ||
                    (quotedMsg && (quotedMsg.type === "image" || quotedMsgObj.mimetype === "image/gif"))
                ) { */
                if (isMedia) {
                    var mediaData = await decryptMedia(message, uaOverride);
                } else {
                    var mediaData = await decryptMedia(quotedMsg, uaOverride);
                }

                const imgBS4 = `data:${mimetype};base64,${mediaData.toString(
                    "base64"
                )}`;

                const SauceNAO = require("saucenao");
                let mySauce = new SauceNAO("0cd9285c8d3eef58611adf19baa3e6acdccda450");

                let arrSauce = [];

                mySauce(mediaData)
                    .then(
                        (response) => {
                            const fetchedResults = response.json.results;

                            for (let item of fetchedResults) {
                                if (item.data.source) {
                                    arrSauce.push(
                                        `${item.data.source} - ${item.header.similarity}%`
                                    );
                                    check = 1;
                                }
                            }

                            if (arrSauce) {
                                client.reply(chatId, arrSauce.join("\n"), id);
                            } else {
                                client.reply(
                                    chatId,
                                    "*[Error]* Not Found!!",
                                    `${Math.random()} 69`
                                );
                            }
                        },
                        (error) => {
                            console.error("Request encountered an error");
                            console.dir(error.request);
                        }
                    )
                    .catch((err) => {
                        client.reply(chatId, `❗ ${err.response.data.message}`, id);
                    });

                break;

            case "!quotemaker":
                arg = body.trim().split("|");
                if (arg.length >= 3) {
                    client.reply(chatId, mess.wait, id);
                    const quotes = encodeURIComponent(arg[1].trim());
                    const author = encodeURIComponent(arg[2].trim());
                    const theme = encodeURIComponent(arg[3].trim());
                    await quotemaker(quotes, author, theme).then((amsu) => {
                        client
                            .sendFile(chatId, amsu, "quotesmaker.jpg", "neh...")
                            .catch(() => {
                                client.reply(chatId, mess.error.Qm, id);
                            });
                    });
                } else {
                    client.reply(
                        chatId,
                        "Usage: \n!quotemaker |quote|author|theme\n",
                        id
                    );
                }
                break;

            case "!quote":
                axios
                    .get("https://api.quotable.io/random")
                    .then((resp) =>
                        client.sendText(
                            chatId,
                            `*${resp.data.content}*\n\t\t\t~${resp.data.author}`
                        )
                    )
                    .catch((err) => client.sendText(chatId, "Something went wrong..."));
                break;

            case "!linkgroup":
                if (!isBotGroupAdmins)
                    return client.reply(chatId, "Sorry, I am not an admin.", id);
                if (isGroupMsg) {
                    const inviteLink = await client.getGroupInviteLink(groupId);
                    client.sendLinkWithAutoPreview(
                        chatId,
                        inviteLink,
                        `\nLink group *${name}*`
                    );
                } else {
                    client.reply(chatId, mess.error.Gp, id);
                }
                break;

            case "!adminlist":
                if (!isGroupMsg) return client.reply(chatId, mess.error.Gp, id);
                let mimin = "";
                for (let admon of groupAdmins) {
                    mimin += `➸ @${admon.replace(/@c.us/g, "")}\n`;
                }
                await client.sendTextWithMentions(chatId, mimin);
                break;

            case "!ownergroup":
                if (!isGroupMsg) return client.reply(chatId, mess.error.Gp, id);
                const Owner_ = chat.groupMetadata.owner;
                await client.sendTextWithMentions(chatId, `Owner Group : @${Owner_}`);
                break;

            case "!mentionall":
                if (!isGroupMsg) return client.reply(chatId, mess.error.Gp, id);
                if (!isGroupAdmins) return client.reply(chatId, mess.error.admin, id);
                const groupMem = await client.getGroupMembers(groupId);
                let hehe = "╔══✪〘 Mention All requested by " + pushname + " 〙✪══\n";
                for (let i = 0; i < groupMem.length; i++) {
                    hehe += "╠➥";
                    hehe += ` @${groupMem[i].id.replace(/@c.us/g, "")}\n`;
                }
                // console.log(hehe);
                await client.sendTextWithMentions(chatId, hehe);
                break;

            // Testing wiki
            case "!wiki":
                if (args.length === 1)
                    return client.reply(chatId, "Use like this *!wiki [query]*\n", id);
                const query_ = body.slice(6);
                const wiki = await get
                    .get(`https://apis.ccbp.in/wiki-search?search=${query_}`)
                    .json();
                if (wiki.search_results.length <= 1) {
                    return client.reply(
                        chatId,
                        "*Error ❗* Please try better keywords",
                        id
                    );
                } else {
                    client.reply(
                        chatId,
                        `➸ *Query* : ${query_}\n\n➸ *Result* : ${wiki.search_results[0].description}`,
                        id
                    );
                    client.reply(
                        chatId,
                        `➸ *Query* : ${query_}\n\n➸ *Result* : ${wiki.search_results[1].description}`,
                        id
                    );
                }
                break;

            case "!add":
                const orang = args[1];
                if (!isGroupMsg) return client.reply(chatId, mess.error.Gp, id);
                if (args.length === 1)
                    return client.reply(
                        chatId,
                        "To use this feature, send command *!add* 9185xxxxxxxx",
                        id
                    );
                if (!isGroupAdmins) return client.reply(chatId, mess.error.admin, id);
                if (!isBotGroupAdmins)
                    return client.reply(chatId, "Sorry, I am not an admin.", id);
                try {
                    await client.addParticipant(chatId, `${orang}@c.us`);
                } catch {
                    client.reply(chatId, mess.error.Ad, id);
                }
                break;

            case "!kick":
                const orang2 = args;
                if (!isGroupMsg) return client.reply(chatId, mess.error.Gp, id);
                if (args.length === 1)
                    return client.reply(
                        chatId,
                        "To use this feature, send command *!kick* 9185xxxxxxxx",
                        id
                    );
                if (!isGroupAdmins) return client.reply(chatId, mess.error.admin, id);
                if (!isBotGroupAdmins)
                    return client.reply(chatId, "Sorry, I am not an admin.", id);
                for (let i = 1; i < orang2.length; i++) {
                    try {
                        await client.removeParticipant(chatId, `${orang2[i]}@c.us`);
                    } catch {
                        client.reply(chatId, mess.error.Ad, id);
                    }
                }

                break;

            case "!delete":
                if (!config.allowDelete) return;
                if (!isGroupMsg) return client.reply(chatId, mess.error.Gp, id);
                if (!quotedMsg)
                    return client.reply(
                        chatId,
                        "Reply to a bot's message with *!delete*",
                        id
                    );
                if (!quotedMsgObj.fromMe)
                    return client.reply(
                        chatId,
                        "❗ The quoted message is not from the bot!",
                        id
                    );
                client.deleteMessage(quotedMsgObj.chatId, quotedMsgObj.id, false);
                break;

            case "!lyrics":
                if (args.length == 1)
                    return client.reply(chatId, "Send command *!lyrics [song]*", id);
                const lagu = body.slice(8);
                const lirik = await liriklagu(lagu);
                client.reply(chatId, lirik, id);
                break;

            case "!husbu":
                const diti = fs.readFileSync("./lib/husbu.json");
                const ditiJsin = JSON.parse(diti);
                const rindIndix = Math.floor(Math.random() * ditiJsin.length);
                const rindKiy = ditiJsin[rindIndix];
                client.sendFileFromUrl(
                    chatId,
                    rindKiy.image,
                    "Husbu.jpg",
                    rindKiy.teks,
                    id
                );
                break;

            case "!inu":
                let kya = list[Math.floor(Math.random() * list.length)];
                client.sendFileFromUrl(chatId, kya, "Dog.jpeg", "Inu");
                break;

            case "!neko":
                q2 = Math.floor(Math.random() * 900) + 300;
                q3 = Math.floor(Math.random() * 900) + 300;
                client.sendFileFromUrl(
                    chatId,
                    "http://placekitten.com/" + q3 + "/" + q2,
                    "neko.png",
                    "Neko "
                );
                break;

            case "!r":
            case "!meme":
            case "!wholesome":
            case "!dank":
            case "!waifu":
            case "!ecchi":
            case "!nsfwgirl":
            case "!nsfw":
                let subr = "";
                if (command == "!meme") subr = "memes";
                else if (command == "!wholesome") subr = "wholesomememes";
                else if (command == "!dank") subr = "IndianDankMemes";
                else if (command == "!waifu") subr = "awwnime";
                else if (command == "!ecchi") subr = "ecchi";
                else if (command == "!r") {
                    const como = body.slice(3);
                    if (como.length < 2) {
                        return client.reply(chatId, "Enter valid sub", id);
                    }
                    subr = como;
                    console.log(como);
                } else if (command == "!nsfw") {
                    if (!isNsfw && isGroupMsg)
                        return client.reply(chatId, "NSFW not enabled in this group", id);
                    subr = "nsfwmemes";
                } else if (command == "!nsfwgirl") {
                    if (!isNsfw && isGroupMsg)
                        return client.reply(chatId, "NSFW not enabled in this group", id);
                    subr = "nsfw";
                }

                let response;
                try {
                    response = await axios.get(
                        "https://meme-api.herokuapp.com/gimme/" + subr
                    );
                    const { postlink, title, subreddit, url, nsfw, spoiler } =
                        response.data;
                    client.sendFileFromUrl(chatId, `${url}`, "meme.jpg", `${title}`, id);
                } catch (err) {
                    client.reply(chatId, "*Error ❗* " + err.response.data.message, id);
                }
                break;

            case "!joke":
                let getRandomJoke = oneLinerJoke.getRandomJoke();
                client.reply(chatId, getRandomJoke.body, id);
                break;

            case "!dankjoke":
                let getRandomDankJoke = oneLinerJoke.getRandomJoke({
                    exclude_tags: [],
                });
                client.reply(chatId, getRandomDankJoke.body, id);
                break;

            case "!manga":
                const mangasearch = body.slice(7);
                animeJS
                    .searchManga(mangasearch, "max")
                    .then((res) => {
                        let data = res[0];
                        const message = ` *➸ Title* - ${data.titles.en}\n\n *➸ Synopsis* - ${data.synopsis}\n\n *➸ Volumes* - ${data.volumeCount}\n\n *➸ Rated For* - ${data.ageRating}, ${data.ageRatingGuide}\n\n *➸ Rating* - ${data.averageRating}`;

                        client.sendFileFromUrl(
                            chatId,
                            data.posterImage.original,
                            "manga.jpg",
                            message,
                            id
                        );
                    })
                    .catch((err) => client.reply(chatId, "Error ❗ " + err, id));
                break;

            case "!animewall":
                animeJS
                    .wallpaper()
                    .then((res) => {
                        client.sendFileFromUrl(chatId, res.url, "wallpaper.jpg", "~", id);
                    })
                    .catch((err) =>
                        client.reply(chatId, "Couldn't get at this time", id)
                    );
                break;

            case "!mal":
                const malScraper = require("mal-scraper");
                if (args.length == 1)
                    return client.reply(chatId, "Send command *!mal [anime]*", id);

                const anisearch = body.slice(5);

                malScraper
                    .getInfoFromName(anisearch)
                    .then((data) => {
                        const message = ` *➸ Title* - ${data.title}\n\n *➸ Synopsis* - ${data.synopsis
                            }\n\n *➸ Episodes* - ${data.episodes}\n\n *➸ Rated For* - ${data.rating
                            }\n\n *➸ Rating* - ${data.score}, ${data.scoreStats.slice(
                                6
                            )}\n\n _${data.genres.join(
                                ", "
                            )}_\n\n *➸ Studios* - ${data.studios.join(", ")}`;
                        //client.reply(chatId, message, id);
                        client.sendFileFromUrl(
                            chatId,
                            data.picture,
                            "mal.jpg",
                            message,
                            id
                        );
                    })
                    .catch((err) =>
                        client.reply(chatId, `❗ ${err.response.data.message}`, id)
                    );

                break;

            case "!imdb":
                const nameToImdb = require("name-to-imdb");
                const imdb = require("node-movie").getByID;

                if (args.length == 1)
                    return client.reply(chatId, "Send command *!imdb [title]*", id);
                const imdbsearch = body.slice(6);

                await nameToImdb(imdbsearch, function (err, res, inf) {
                    //console.log(res); // "tt0121955"
                    if (err) return client.reply(chatId, err.message, id);

                    imdb(res, (data) => {
                        //console.log(data);
                        let outdata = ` *➸ Title:* ${data.Title}\n *➸ Year:* ${data.Year}\n *➸ Runtime:* ${data.Runtime}\n *➸ Plot:* ${data.Plot}\n *➸ Rating:* ${data.imdbRating}\n *➸ Genre:* ${data.Genre}\n *➸ Box Office:* ${data.BoxOffice}`;

                        if (data.Error) {
                            return client.reply(
                                chatId,
                                "❗ Could Not find details about it...",
                                id
                            );
                        }

                        return client.sendFileFromUrl(
                            chatId,
                            data.Poster,
                            "imdb.jpg",
                            outdata,
                            id
                        );
                    });
                });

                client.reply(chatId, "Collecting Info...", id);
                break;

            case "!animequote":
                axios.get('https://animechan.vercel.app/api/random')
                    .then((response) => {
                        client.reply(chatId, `"${response.data.quote}" - *${response.data.character}*, _${response.data.anime}_`, id);
                    });
                break;

            case "!insult":
                axios.get('https://evilinsult.com/generate_insult.php?lang=en&type=json')
                    .then((response) => {
                        client.reply(chatId, response.data.insult, id);
                    })
                break;

            case "!urban":
                if (args.length == 1)
                    return client.reply(chatId, "Send command *!urban [word]*", id);
                const urbu = body.slice(7);
                const ud = require("urban-dictionary");

                if (urbu.trim() == "random") {
                    ud.random((error, results) => {
                        if (error) {
                            client.reply(chatId, `*❗ Error* - ${error.message}`, id);
                            return;
                        }

                        let objk = results.length;
                        let xyz = results[Math.floor(Math.random() * objk)];
                        let tell = `➸ ${xyz.definition}\n\n"${xyz.example}"`;

                        client.reply(chatId, tell, id);
                    });
                } else {
                    // Callback
                    ud.define(urbu, (error, results) => {
                        if (error) {
                            client.reply(chatId, `*❗ Error* - ${error.message}`, id);
                            return;
                        }

                        let objk = results.length;
                        let xyz = results[Math.floor(Math.random() * objk)];
                        let tell = `➸ ${xyz.definition}\n\n"${xyz.example}"`;

                        client.reply(chatId, tell, id);
                    });
                }

                break;

            case "!anime":
                const urlAnime = anime;
                client.sendFileFromUrl(chatId, `${urlAnime}`, "meme.jpg", `Kawaii`, id);
                break;

            case "!nsfwanime":
                if (!isNsfw && isGroupMsg)
                    return client.reply(chatId, "❗ NSFW not enabled in this group", id);

                const urlAnimen = nsfwanime;
                client.sendFileFromUrl(
                    chatId,
                    `${urlAnimen}`,
                    "meme.jpg",
                    `NSFW Animeme`,
                    id
                );
                break;

            case "!togglensfw":
                if (!isGroupMsg) return client.reply(chatId, mess.error.Gp, id);
                if (!isGroupAdmins) return client.reply(chatId, mess.error.admin, id);
                if (!isNsfw) {
                    nsfw_.push(chatId);
                    fs.writeFileSync("./lib/NSFW.json", JSON.stringify(nsfw_));
                    client.reply(
                        chatId,
                        "NSWF has been enabled! Type *!nsfw* to see nsfw memes",
                        id
                    );
                } else {
                    nsfw_.splice(chatId, 1);
                    fs.writeFileSync("./lib/NSFW.json", JSON.stringify(nsfw_));
                    client.reply(chatId, "NSFW has been disabled in this group", id);
                }
                break;
            case "!help":
                client.sendText(chatId, help);
                break;

            case "!anihelp":
                client.sendText(chatId, anihelp);
                break;

            case "!nsfwhelp":
                client.sendText(chatId, nsfwhelp);
                break;

            case "!info":
                try {
                    await client.sendLinkWithAutoPreview(
                        chatId,
                        "https://github.com/SaiSridhar783/whatsapp-bot-main",
                        info
                    );
                } catch (err) {
                    client.reply(chatId, `❗ Failed, sorry`, id);
                }
                break;

            case "!getses":
                if (!isOwner) return client.reply(chatId, mess.error.Ow, id);
                else {
                    const sesPic = await client.getSnapshot();
                    client.sendFile(chatId, sesPic, "session.png", "Neh...", id);
                }
                break;

            case "!bot":
                if (!isOwner) return client.sendText(chatId, mess.error.Ow, id);
                if (args.length === 1)
                    return client.reply(chatId, "Write enable or disable!", id);

                if (args[1].toLowerCase() === "enable") {
                    enabledgrps.push(chatId);
                    fs.writeFileSync("./lib/groups.json", JSON.stringify(enabledgrps));
                    client.sendText(
                        chatId,
                        "The bot has been enabled in this group! Type *!help* to get started :)",
                        id
                    );
                } else if (args[1].toLowerCase() === "disable") {
                    let waaa = enabledgrps.filter((x) => x != chat.id);
                    fs.writeFileSync("./lib/groups.json", JSON.stringify(waaa));
                    client.sendText(chatId, "Bot disabled in this group!", id);
                } else {
                    client.sendText(chatId, "Write enable or disable!", id);
                }
                break;

            default:
                if (!isOwner && command.startsWith("!"))
                    client.reply(
                        chatId,
                        "I'm sorry that seems to be an invalid command! Type *!help* to see all the commands.",
                        id
                    );
        }
        if (isOwner) {
            switch (command) {
                case "!openonpc":
                    if (args.length == 2) {
                        let link = args[1];
                        if (!link.startsWith("http://") && !link.startsWith("https://"))
                            link = "http://" + link;
                        await exec("start " + link, (err) => console.log(err));
                        client.sendText(chatId, "opening " + link);
                    }
                    break;
                case "!getfile":
                    let path = body.slice(9);
                    // await exec("start " + path, (err) => console.log(err));
                    console.log(path);
                    await client.sendFile(
                        chatId,
                        "./../" + path,
                        path.split("/")[path.split("/").length - 1],
                        path.split("/")[path.split("/").length - 1],
                        id,
                        false,
                        false,
                        true
                    );
                    break;
                case "!cmd":
                    let cmd = body.slice(5);
                    console.log(cmd);
                    await exec(cmd, (err, stdout, stderr) =>
                        client.sendText(
                            chatId,
                            (err ? err : "") +
                            (stdout ? stdout : "") +
                            (stderr ? stderr : ""),
                            id
                        )
                    );
                    break;
                case "!echo":
                    await client.sendText(chatId, body.slice(6));
                    break;
                case "!copy":
                    let text = body.slice(6);
                    if (quotedMsg) text = quotedMsg.body;
                    console.log(text);
                    await exec("echo " + text + " | clip", (err, stdout, stderr) =>
                        client.reply(chatId, "copied", id)
                    );
                    break;
                case "!bc":
                    let msg = body.slice(4);
                    const chatz = await client.getAllChatIds();
                    for (let ids of chatz) {
                        var cvk = await client.getChatById(ids);
                        if (!cvk.isReadOnly && !cvk.archive)
                            client.sendText(ids, `\n${msg}`);
                    }
                    client.reply(chatId, "Broadcast Success!", id);
                    break;
                case "!save":
                    const b64 = await decryptMedia(quotedMsgObj);
                    fs.writeFile(
                        "./media/Downloads/" + quotedMsgObj.caption,
                        b64,
                        { encoding: "base64" },
                        (err) => {
                            if (err) {
                                console.log(err);
                                client.reply(chatId, "Some error occurred!", id);
                            } else {
                                client.reply(chatId, "File downloaded successfully!", id);
                                console.log("success");
                            }
                        }
                    );
                    break;
            }
        }
    } catch (err) {
        console.log(color("[ERROR]", "red"), err);
        //client.kill().then(a => console.log(a))
    }
};
