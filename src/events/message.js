
const { Collection } = require('discord.js');
module.exports = async(client, message) => {
	try {
		global.prefix = client.cache.get(message.guild.id).prefix
	} catch {
		global.prefix = client.config.prefix
	}
    if (!message.content.startsWith(prefix) || message.author.bot) return;
	const args = message.content.slice(prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();
	const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
	if (!command) return;
    if(command.secret && message.author.id != '607148903833403422') return
	if (message.channel.type !== 'text') return 
	if (command.args && !args.length) {
		let reply = client.lang[client.cache.get(message.guild.id).lang]['global'].noArgs.replace('%author%', message.author);
		if (command.usage) reply += client.lang[client.cache.get(message.guild.id).lang]['global'].usage.replace('%usage%',`\`${prefix}${command.name} ${command.usage}\``);
		return message.channel.send(reply);
	}
	if (!client.cooldowns.has(command.name)) {
		client.cooldowns.set(command.name, new Collection());
	}
	const now = Date.now();
	const timestamps = client.cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 3) * 1000;
	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return message.reply(
				client.lang[client.cache.get(message.guild.id).lang]['global'].cooldown
					.replace('%time%', timeLeft.toFixed(1))
					.replace('%command%', commandName)
				);
		}
	}
	

	try {
	command.execute(message, args);
		timestamps.set(message.author.id, now);
		setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
	} catch (error) {
		console.error(error);
		message.reply(client.lang[client.cache.get(message.guild.id).lang]['global'].error);
	}    
}