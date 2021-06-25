module.exports = {
	name: 'nowplaying',
	description: {
		'ru': 'Команда, которая покажет песню, играющую в данный момент.',
		'eng': 'Now playing command.'
	},
	aliases: ['np', 'now'],
	cooldown: 1,
	execute(message) {
		const serverQueue = message.client.queue.get(message.guild.id);
		if (!serverQueue) return message.channel.send(client.lang[client.cache.get(message.guild.id).lang][this.name].nothing);
		return message.channel.send(client.lang[client.cache.get(message.guild.id).lang][this.name].now.replace('%song%', serverQueue.songs[0].title));
		
	}
};
