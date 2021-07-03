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
	},
	slash: {
		"name": "queue",
		"description": "Server's current queue",
		execute(client, interaction) {
			const serverQueue = client.queue.get(interaction.guild_id);
		if (!serverQueue) return client.api.interactions(interaction.id, interaction.token).callback.post({
			data: {
				type: 4,
				data: {
					flags: 64,
					content: client.lang[client.cache.get(interaction.guild_id).lang][this.name].nothing
				}
			}
		}) 
		return client.api.interactions(interaction.id, interaction.token).callback.post({
			data: {
				type: 4,
				data: {
					content: client.lang[client.cache.get(interaction.guild_id).lang][this.name].name
					.replace('%songs%', serverQueue.songs.slice(0, 10).map(song => `**-** ${song.title}`).join('\n'))
					.replace('%now%', serverQueue.songs[0].title)
				}
			}
		})
		}
	  }
};
