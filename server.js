const http = require("http");
const querystring = require("querystring");
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits, Partials } = require('discord.js');
const client = new Client({ 
  intents: [
    GatewayIntentBits.Guilds, 
    GatewayIntentBits.MessageContent, 
    GatewayIntentBits.GuildMessages, 
    GatewayIntentBits.DirectMessages], 
  partials: [Partials.Channel] });;
client.commands = new Collection();

http
  .createServer(function (req, res) {
    if (req.method == "POST") {
      var data = "";
      req.on("data", function (chunk) {
        data += chunk;
      });
      req.on("end", function () {
        if (!data) {
          console.log("No post data");
          res.end();
          return;
        }
        var dataObject = querystring.parse(data);
        console.log("post:" + dataObject.type);
        if (dataObject.type == "wake") {
          console.log("Woke up in post");
          res.end();
          return;
        }
        res.end();
      });
    } else if (req.method == "GET") {
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end("Discord Bot is active now\n");
    }
  })
  .listen(3000);

client.once(Events.ClientReady, c => {
  console.log("Bot準備完了～");
  client.user.setPresence({ activities: [{ name: 'ボックス管理' }] });
});


// commandsフォルダから、.jsで終わるファイルのみを取得
client.commands = new Collection(); //コマンド用
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));


 for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  // 取得した.jsファイル内の情報から、コマンドと名前をListenner-botに対して設定
  if ("data" in command && "execute" in command) {
    client.commands.set(command.data.name, command);
  } else {
    console.log(
      `[WARNING]  ${filePath} のコマンドには、必要な "data" または "execute" プロパティがありません。`
    );
  }
}

// コマンドが送られてきた際の処理
client.on(Events.InteractionCreate, async (interaction) => {
  // コマンドでなかった場合は処理せずさよなら。
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);

  // 一致するコマンドがなかった場合
  if (!command) {
    console.error(` ${interaction.commandName} というコマンドは存在しません。`);
    return;
  }

  try {
    // コマンドを実行
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "コマンドを実行中にエラーが発生しました。",
      ephemeral: true,
    });
  }
});


if (process.env.LEAVES == undefined) {
  console.log("LEAVESが設定されていません。");
  process.exit(0);
}

client.login(process.env.LEAVES);

/*fetch('https://uttermost-navy-friday.glitch.me', {
    method: 'GET'
}).then((response) => {
    if (!response.ok) {
        throw 'error response';
    }
    // テキストの取得.
    return response.text();
}).then((text) => {
    console.log(text);
}).catch((error) => {
    console.error(error);
});*/
