module.exports = {
	name: 'pause',
	description: {
		'ru': 'Команда, которая приостанавливает воспроизведение музыки.',
		'eng': 'Pause command.'
	},
	cooldown: 1,
	execute(message) {
		const serverQueue = message.client.queue.get(message.guild.id);
		if(!serverQueue.playing){
			return message.channel.send(client.lang[client.cache.get(message.guild.id).lang][this.name].notPlaying);
		} else if (serverQueue) {
			serverQueue.playing = false;
			serverQueue.connection.dispatcher.pause();
			return message.channel.send(client.lang[client.cache.get(message.guild.id).lang][this.name].paused);
		}
		return message.channel.send(client.lang[client.cache.get(message.guild.id).lang][this.name].nothing);
	}
};
