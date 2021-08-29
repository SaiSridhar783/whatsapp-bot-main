const fetch = require("node-fetch");
const { getBase64 } = require("./fetcher");
const emoji = require("emoji-regex");

const liriklagu = async (lagu) => {
  const response = await fetch(`http://scrap.terhambar.com/lirik?word=${lagu}`);
  if (!response.ok)
    throw new Error(`unexpected response ${response.statusText}`);
  const json = await response.json();
  if (json.status === true) return `Lyrics ${lagu}\n\n${json.result.lirik}`;
  return `[ Error ] Lyrics for ${lagu} not found!`;
};

const quotemaker = async (quotes, author = "Wakatsuki", type = "random") => {
  var q = quotes.replace(/ /g, "%20").replace("\n", "%5Cn");
  const response = await fetch(
    `https://terhambar.com/aw/qts/?kata=${q}&author=${author}&tipe=${type}`
  );
  if (!response.ok)
    throw new Error(`unexpected response ${response.statusText}`);
  const json = await response.json();
  if (json.status) {
    if (json.result !== "") {
      const base64 = await getBase64(json.result);
      return base64;
    }
  }
};

const emojiStrip = (string) => {
  return string.replace(emoji, "");
};

const sleep = async (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

exports.liriklagu = liriklagu;
exports.quotemaker = quotemaker;
exports.emojiStrip = emojiStrip;
exports.sleep = sleep;
