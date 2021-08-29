function help() {
  return `☾ Group Commands ☽
╽
┠❥ *!add 9185xxxxxxxx*
┠❥ *!kick 9185xxxxxxxx*
┠❥ *!mentionAll*
┠❥ *!adminList*
┠❥ *!ownerGroup*
┠❥ *!linkGroup*
┠❥ *!delete* (delete message from bot)
╿
☾ Others Commands ☽
╽
┠❥ *!anihelp* (for weebs)
┠❥ *!sticker* / *!st* [wname] [nobg] [nocrop]
┠❥ *!meme*
┠❥ *!wholesome*
┠❥ *!joke*
┠❥ *!quote*
┠❥ *!toggleNSFW*
┠❥ *!nsfwhelp*
┠❥ *!neko* (random cat pics)
┠❥ *!inu* (random dog pics)
┠❥ *!tts [lang code] [text]* (text to speech) (code like *en=english, hi=hindi, ja=japanese*)
┠❥ *!wiki [query]*
┠❥ *!imdb [title]*
┠❥ *!urban [word]* (search urban dictionary)
┠❥ *!urban random* (random urban word)
┠❥ *!quotemaker [|text|author|theme|]* (theme can be any keyword to search for an image)
┠❥ *!lyrics [songName]*
┠❥ *!animequote* (random quote from anime)
┠❥ *!insult* (random insult)
┠❥ *!info*
╿
╰╼❥ Have fun !!`;
}

function anihelp() {
  return `
  ☾ Commands ☽
╽
┠❥ *!mal [anime title]* Search MyAnimeList for the anime
┠❥ *!manga [manga title]* Details about the manga.
┠❥ *!animewall* Anime related wallpaper.
┠❥ *!husbu*
┠❥ *!waifu*
┠❥ *!anime* (kawaii character)
┠❥ *!nsfwanime* (random anime nsfw)
┠❥ *!ecchi*
┠❥ *!sauce* (search for anime from image)
┠❥ *!saucenao* (beta) (search for anime from image)
╿
╰╼❥ Have fun !!
  `;
}

function nsfwhelp() {
  return `
  ☾ Commands ☽
╽
┠❥ *!nsfwgirl*
┠❥ *!dank*
┠❥ *!dankjoke*
┠❥ *!nh [code]* (iykyk)
┠❥ *!r [subreddit]* (get random image from subreddit)
╿
╰╼❥ Have fun !!
  `;
}

exports.help = help();
exports.anihelp = anihelp();
exports.nsfwhelp = nsfwhelp();

function info() {
  return `This bot is made in Node.js / JavaScript
Source code bot : https://github.com/SaiSridhar783/whatsapp-bot
Owner Bot : wa.me/917760317149
Author : Akula Sai Sridhar`;
}
exports.info = info();
