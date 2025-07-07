const { REST, Routes } = require("discord.js");
const fs = require("node:fs");

const rest = new REST({ version: "10" }).setToken(process.env.LEAVES); //botのtoken
//先に既存のコマンドを削除する
// for guild-based commands
let delTCs = []; //["1172610843230359633", process.env.TOKIWA]
for(let i = 0; i < delTCs.length; i++){
const delTCommand = String(delTCs[i][0]); //消したいコマンドのIDをパソコン版管理画面から持ってくる
if(delTCommand != ""){
rest.delete(Routes.applicationGuildCommand(process.env.SKIN, delTCs[i][1], String(delTCommand)))
	.then(() => console.log('ギルドコマンド' + delTCommand + 'は削除されました'))
	.catch(console.error);}
}
// for global commands
let delGCs = ["1197413917341790300"]; //"1186298550280274051"
for(let i = 0; i < delGCs.length; i++){
const delGCommand = String(delGCs[i]);
if(delGCommand != ""){
rest.delete(Routes.applicationCommand(process.env.SKIN, String(delGCommand)))
	.then(() => console.log('グローバルコマンド' + delGCommand + 'は削除されました'))
	.catch(console.error);}
}