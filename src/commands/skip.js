module.exports = {
	name: 'skip',
	description: {
		'ru': 'Пропустить песню, которая сейчас играет.',
		'eng': 'Skip command.'
	},
	aliases: [ 's' ],
	cooldown: 1,
	execute(message) {
		const { channel } = message.member.voice;
		if (!channel) return message.channel.send(client.lang[client.cache.get(message.guild.id).lang][this.name].voice);
		const serverQueue = message.client.queue.get(message.guild.id);
		if (!serverQueue) return message.channel.send(client.lang[client.cache.get(message.guild.id).lang][this.name].nothing);
		serverQueue.connection.dispatcher.end('Skip command has been used!');
		message.react('✅')
	}
};
