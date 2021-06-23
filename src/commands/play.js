const { Util } = require('discord.js');
const ytdl = require('ytdl-core');
let search = require('youtube-search');
let opts = {
  maxResults: 1,
  key: process.env.YOUTUBE_TOKEN,
  type: 'video'
};
module.exports = {
	name: 'play',
	description: 'Play command.',
	usage: '[command name]',
	aliases: [ 'p' ],
	args: false,
	cooldown: 3,
	async execute(message, args) {
			if(!args[0]) {
				const serverQueue = message.client.queue.get(message.guild.id);
				if (serverQueue && !serverQueue.playing) {
					serverQueue.playing = true;
					serverQueue.connection.dispatcher.resume();
					return message.channel.send('▶ Resumed the music for you!');
				} else {
					let reply = `You didn't provide any arguments, ${message.author}!`;
					if (this.usage) reply += `\nThe proper usage would be: \`${message.client.config.prefix}${this.name} ${this.usage}\``;
					return message.channel.send(reply);	
				}

			}
		const { channel } = message.member.voice;
		if (!channel) return message.channel.send('I\'m sorry but you need to be in a voice channel to play music!');
		const permissions = channel.permissionsFor(message.client.user);
		if (!permissions.has('CONNECT')) return message.channel.send('I cannot connect to your voice channel, make sure I have the proper permissions!');
		if (!permissions.has('SPEAK')) return message.channel.send('I cannot speak in this voice channel, make sure I have the proper permissions!');

		let song = await search(args.join(' ').replace(/<(.+)>/g, '$1'), opts, async function(err, results) {
			let result = results
		if(!result) {
			
		let idregex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/gi; 
		let idreg = idregex.exec(args[0])
			if(!idreg) {
				return message.channel.send('❌ I couldn\'t find song for specific query! Try another')
			}
		let id = idreg[1]
		let song = await require('node-fetch')('https://www.googleapis.com/youtube/v3/videos?part=snippet&id=' + id + '&key=' + process.env.YOUTUBE_TOKEN).then(r => r.json())
		try {
			let result = [{
			id: song.items[0].id,
			title: song.items[0].snippet.title,
			link: 'https://www.youtube.com/watch?v=' + song.items[0].id
		}]
	} catch {
		return message.channel.send('❌ I couldn\'t find song for specific query! Try another')
	}
		
		} 
			if(err) return console.log(err);
		  let song = {
				id: result[0].id,
				title: Util.escapeMarkdown(result[0].title),
				url: result[0].link
			};
		const serverQueue = message.client.queue.get(message.guild.id);
		
		if (serverQueue) {
			serverQueue.songs.push(song);
			return message.channel.send(`✅ **${song.title}** has been added to the queue!`);
		}

		const queueConstruct = {
			textChannel: message.channel,
			voiceChannel: channel,
			connection: null,
			songs: [],
			volume: 2,
			playing: true
		};
		message.client.queue.set(message.guild.id, queueConstruct);
		queueConstruct.songs.push(song);

		const play = async song => {
			const queue = message.client.queue.get(message.guild.id);
			if (!song) {
				queue.voiceChannel.leave();
				message.client.queue.delete(message.guild.id);
				return;
			}

			const dispatcher = queue.connection.play(ytdl(song.url, { quality: 'highestaudio' }), { bitrate: 'auto' })
				.on('finish', () => {
					queue.songs.shift();
					play(queue.songs[0]);
				})
				.on('error', error => console.error(error));
			dispatcher.setVolumeLogarithmic(queue.volume / 5);
			queue.textChannel.send(`🎶 Start playing: **${song.title}**`);
		};

		try {
			const connection = await channel.join();
			queueConstruct.connection = connection;
			play(queueConstruct.songs[0]);
		} catch (error) {
			console.error(`I could not join the voice channel: ${error}`);
			message.client.queue.delete(message.guild.id);
			await channel.leave();
			return message.channel.send(`I could not join the voice channel: ${error}`);
		}
		});
		
	}
};