require('dotenv').config();
const { readdirSync } = require('fs');
const { join } = require('path');
const MusicClient = require('./struct/Client');
const { MessageEmbed } = require('discord.js');
global.embed = MessageEmbed
global.client = new MusicClient({ token: process.env.DISCORD_TOKEN, prefix: process.env.DISCORD_PREFIX });

const commandFiles = readdirSync(join(__dirname, 'commands')).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(join(__dirname, 'commands', `${file}`));
	client.commands.set(command.name, command);
}
readdirSync(join(__dirname, "events"))
        .filter(file => file.endsWith(".js"))
        .forEach(file => {
            const event = require(`../src/events/${file}`);
            let eventName = file.split(".")[0];
            client.on(eventName, event.bind(null, client));
            delete require.cache[require.resolve(`../src/events/${file}`)];
        });
        
require('./struct/mongo.js')(client)
client.login(client.config.token);
