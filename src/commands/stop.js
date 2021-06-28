module.exports = {
	default: {
	name: 'stop',
	description: {
		'ru': 'Команда, отключающая воспроизведение песен.',
		'eng': 'Stop command.'
	},
	aliases: [ 'fuckoff' ],
	cooldown: 1,
	execute(message) {
		const { channel } = message.member.voice;
		if (!channel) return message.channel.send(client.lang[client.cache.get(message.guild.id).lang][this.name].voice);
		const serverQueue = message.client.queue.get(message.guild.id);
		if (!serverQueue) return message.channel.send(client.lang[client.cache.get(message.guild.id).lang][this.name].nothing);
		serverQueue.songs = [];
		serverQueue.connection.dispatcher.end('Stop command has been used!');
		message.react('✅')
	}
}
};
