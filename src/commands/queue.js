module.exports = {
	default: {
	name: 'queue',
	description: {
		'ru': 'Очередь проигрывания сервера.',
		'eng': 'Queue command.'
	},
	cooldown: 1,
	execute(message) {
		const serverQueue = message.client.queue.get(message.guild.id);
		if (!serverQueue) return message.channel.send(client.lang[client.cache.get(message.guild.id).lang][this.name].nothing);
		return message.channel.send(
			client.lang[client.cache.get(message.guild.id).lang][this.name].name
				.replace('%songs%', serverQueue.songs.slice(0, 10).map(song => `**-** ${song.title}`).join('\n'))
				.replace('%now%', serverQueue.songs[0].title)
		);
	}
	}
};
