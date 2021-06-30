const Genius = require("genius-lyrics");
const lyrics = new Genius.Client(process.env.LYRICS_KEY);

module.exports = {
    default: {
    name: 'lyrics',
    description: {
        'ru': 'Команда, которая позволяет найти текст указанной песни.',
        'eng': 'Lyrics-search command.'
    },
	aliases: ['l', 'text'],
    args: false,
    usage: '[song name]',
	cooldown: 3,
    async execute(message, args) {
        const prefix = client.cache.get(message.guild.id).prefix || client.config.prefix
        let query = args.join(' ')
            if(!args.length && message.client.queue.get(message.guild.id)) {
                query = message.client.queue.get(message.guild.id).songs[0].title
            } else if(!args.length) {
                let reply = client.lang[client.cache.get(message.guild.id).lang]['global'].noArgs.replace('%author%', message.author);
                if (this.usage) reply += client.lang[client.cache.get(message.guild.id).lang]['global'].usage.replace('%usage%',`\`${prefix}${this.name} ${this.usage}\``); 
                return message.channel.send(reply)               
            }
        try {
            const search = await lyrics.songs.search(query)
        const found = search[0]

        const text = await found.lyrics()
        const length = 1900; // длина одной части
        const pattern = new RegExp(".{1," + length + "}", "g");
        let res = text.match(/(.|[\r\n]){1,1900}/g);
        let i = 1
        const msg = client.lang[client.cache.get(message.guild.id).lang][this.name].name.replace('%name%', found.title) + res[0]
        const responce = await message.channel.send(msg)
            .then(m => {
                if(res.length > 1) {
                    m.react('➡️')
                    const filter = (reaction, user) => {
                        return ['➡️'].includes(reaction.emoji.name) && user.id === message.author.id;
                    };
            const collector = m.createReactionCollector(filter, { max: res.length - 1, time: 15000 });
            collector.on('collect', (reaction, user) => {
                console.log(reaction)
                if(reaction.emoji.name == '➡️') {
                    m.edit(client.lang[client.cache.get(message.guild.id).lang][this.name].name.replace('%name%', found.title) + res[i])
                    i++
                    
                }
            })
            collector.on('end', () => {
            if(message.channel.permissionsFor(message.guild.me).has('MANAGE_MESSAGES')){
                m.reactions.removeAll()
            }})
                }
                
        })


        } catch {
        message.channel.send(client.lang[client.cache.get(message.guild.id).lang][this.name].error)
        }
    }
    }, 
    slash: {
        "name": "lyrics",
        "description": "Lyrics of nowplaying command, or that which was provided",
        "options": [
          {
            "type": 3,
            "name": "song",
            "description": "Song name",
            "required": false
          }
        ],
        async execute(client, interaction, args) {
            const prefix = client.cache.get(interaction.guild_id).prefix || client.config.prefix
        
            if(!args) {
                let reply = client.lang[client.cache.get(interaction.guild_id).lang]['global'].noArgs.replace('%author%', client.users.cache.get(interaction.member.user.id).username);
                if (this.usage) reply += client.lang[client.cache.get(interaction.guild_id).lang]['global'].usage.replace('%usage%',`\`${prefix}${this.name} ${this.usage}\``); 
                return client.api.interactions(interaction.id, interaction.token).callback.post({
                    data: {
                        type: 4,
                        data: {
                            content: reply
                        }
                    }
                })
            }
            let query = args[0].value
            if(!args.length && message.client.queue.get(interaction.guild_id)) {
                query = message.client.queue.get(interaction.guild_id).songs[0].title
            } else if(!args.length) {
                let reply = client.lang[client.cache.get(interaction.guild_id).lang]['global'].noArgs.replace('%author%', message.author);
                if (this.usage) reply += client.lang[client.cache.get(interaction.guild_id).lang]['global'].usage.replace('%usage%',`\`${prefix}${this.name} ${this.usage}\``); 
                return client.api.interactions(interaction.id, interaction.token).callback.post({
                    data: {
                        type: 4,
                        data: {
                            content: reply
                        }
                    }
                })               
            }
        try {
            const search = await lyrics.songs.search(query)
        const found = search[0]

        const text = await found.lyrics()
        let res = text.match(/(.|[\r\n]){1,1900}/g);
        let i = 1
        const msg = client.lang[client.cache.get(interaction.guild_id).lang][this.name].name.replace('%name%', found.title) + res[0]
        const responce = await client.api.interactions(interaction.id, interaction.token).callback.post({
            data: {
                type: 4,
                data: {
                    content: msg
                }
            }
        })


        } catch {
            client.api.interactions(interaction.id, interaction.token).callback.post({
				data: {
					type: 4,
					data: {
                        flags: 64,
						content: client.lang[client.cache.get(interaction.guild_id).lang][this.name].error
					}
				}
			})
        }            
        }
      }
}