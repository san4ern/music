module.exports = {
	name: 'resume',
	description: {
		'ru': 'Возобновление воспроизведения песен.',
		'eng': 'Resume command.'
	},
	cooldown: 1,
	execute(message) {
		const serverQueue = message.client.queue.get(message.guild.id);
		if(serverQueue.playing){
			return message.channel.send(client.lang[client.cache.get(message.guild.id).lang][this.name].playing);
		} else if (serverQueue) {
			serverQueue.playing = true;
			serverQueue.connection.dispatcher.resume();
			return message.channel.send(client.lang[client.cache.get(message.guild.id).lang][this.name].resumed);
		}
		return message.channel.send(client.lang[client.cache.get(message.guild.id).lang][this.name].nothing);
	}
};
