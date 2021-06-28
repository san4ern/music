module.exports = {
	default: {
	name: 'volume',
	description: {
		'ru': 'Команда, которая позволит изменить громкость песни',
		'eng': 'Volume command.'
	},
	args: false,
	usage: '[number]',
	cooldown: 3,
	execute(message, args) {
		const { channel } = message.member.voice;
		if (!channel) return message.channel.send(client.lang[client.cache.get(message.guild.id).lang][this.name].voice);
		const serverQueue = message.client.queue.get(message.guild.id);
		if (!serverQueue) return message.channel.send(client.lang[client.cache.get(message.guild.id).lang][this.name].nothing);
		if (!args[0]) return message.channel.send(client.lang[client.cache.get(message.guild.id).lang][this.name].noArgs.replace('%volume%', serverQueue.volume));
		if(isNaN(args[0])) return message.channel.send(client.lang[client.cache.get(message.guild.id).lang][this.name].nan)
		serverQueue.volume = args[0]; // eslint-disable-line
		serverQueue.connection.dispatcher.setVolumeLogarithmic(args[0] / 5);
		return message.channel.send(client.lang[client.cache.get(message.guild.id).lang][this.name].success.replace('%new%', args[0]));
	}
}
};
