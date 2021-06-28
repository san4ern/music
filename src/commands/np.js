module.exports = {
	default: {
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
	},
	slash: {
		"name": "nowplaying",
		"description": "The command, that shows nowplaying music",
		execute(client, interaction, args) {
			const serverQueue = client.queue.get(interaction.guild_id);
			if(!serverQueue) {
				return client.api.interactions(interaction.id, interaction.token).callback.post({
					data: {
						type: 4,
						data: {
							content: client.lang[client.cache.get(interaction.guild_id).lang][this.name].nothing
						}
					}
				})
			}
			client.api.interactions(interaction.id, interaction.token).callback.post({
				data: {
					type: 4,
					data: {
						content: client.lang[client.cache.get(interaction.guild_id).lang][this.name].now.replace('%song%', serverQueue.songs[0].title)
					}
				}
			})
			}
	  }
};
