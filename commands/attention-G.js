const { SlashCommandBuilder } = require("discord.js");
const fetch = require("node-fetch");
/*import fetch from "node-fetch";*/

module.exports = {
  data: new SlashCommandBuilder()
    .setName("attention")
    .setDescription("新しい通知を確認できます")
    .addStringOption((option) =>
      option
        .setName("ボックス名")
        .setDescription("確認したいボックス名を入力")
        .setMaxLength(100))
    .addStringOption((option) =>
      option
        .setName("あいことば")
        .setDescription("ボックスのあいことばを入力")
        .setMaxLength(100))
    .addStringOption((option) =>
      option
        .setName("確認する範囲")
        .setDescription("確認したい年月日8ケタ（例: 20231104）もしくは「未読」と入力")
        .setMaxLength(100))
    .addStringOption((option) =>
      option
        .setName("通知の順番")
        .setDescription("確認したい通知を入力（例: 1）。1が現時点で最も新着")
        .setMaxLength(100)),
  async execute(interaction) {
    const osaifumei = interaction.options.getString('ボックス名');
    const key = interaction.options.getString('あいことば');
    const hanni = interaction.options.getString('確認する範囲');
    const zyunnbann = interaction.options.getString('通知の順番');
    console.log(osaifumei, key, hanni, zyunnbann);
    const wait = require('util').promisify(setTimeout);
    await interaction.deferReply({ephemeral: true});
    await wait(2000);
    const messages = await callApi(osaifumei, key, hanni, zyunnbann);
    if(messages.indexOf("返信中止")>-1){console.log("返信を中止します"); return;}
    await interaction.editReply({ content: 
         "- ボックス名: " + osaifumei + "\n" + 
         "- 確認する範囲: " + hanni + "\n" + 
         "- 通知の順番: " + zyunnbann + "\n" + 
         messages, 
          }); 
    console.log("返信しました"); 
  },
};

async function callApi(osaifumei, key, hanni, zyunnbann) {
  try{
    const uri = encodeURI('https://script.google.com/macros/s/AKfycbz3Abd7feQ9N_JkQhYXtMFCaT4_I0i2ujfGHunInRPmyvn6Q6_gT_RWGI-KHZtGJ2dQ/exec?p1=' + osaifumei + '&p2=' + key + '&p3=' + hanni + '&p4=' + zyunnbann);
    console.log(uri);
    const res = await fetch(uri);
  /*https://script.google.com/macros/s/AKfycbyvXxbLX9M2N79ItL-xGq9pT8DroqrbkorIDtm-DJ9QCLx9NXVLJWvBDcmTSaVN_3f8/exec?p1=はわのふ（khavanoff_8608）&p2=nonono&p3=20231110*/
    const users = await res.json();
    const strings = JSON.parse(JSON.stringify(users));
    const data = strings["通知"];
    console.log(data)
  return data;}catch (error){console.log(error); return "APIエラーでは？";}
};