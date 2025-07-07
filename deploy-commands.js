const { REST, Routes } = require("discord.js");
const fs = require("node:fs");

const commands = [];
const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith("-G.js")); //グローバルコマンドは「-G」。テストコマンドは「-T」

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: "10" }).setToken(process.env.LEAVES); //botのtoken

(async () => {
  try {
    console.log(
      `${commands.length} 個のアプリケーションコマンドを登録します。`
    );

    const data = await rest.put(
      Routes.applicationCommands(process.env.SKIN), //グローバルコマンド用
      //Routes.applicationGuildCommands(process.env.SKIN, process.env.TOKIWA2), //ギルドコマンド用。cleient IDとGuild ID
      { body: commands }
    );

    console.log(`${data.length} 個のアプリケーションコマンドを登録しました。`);
  } catch (error) {
    console.error(error);
  }
})();