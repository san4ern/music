module.exports = {
    default: {
    name: 'language',
    description: {
        'ru': 'Команда для смены языка интерфейса.',
        'eng': 'Language-changing command.'
    },
    aliases: ['lang'],    
    cooldown: 10,
    execute(message, args) {
    if(!message.member.permissions.has('MANAGE_GUILD')) return message.channel.send(
        client.lang[client.cache.get(message.guild.id).lang][this.name].noPerms
    )
        if(client.cache.get(message.guild.id).lang == 'ru') {
            let lang = 'eng'
            mongo.guilds.updateOne({
                guildID: message.guild.id
            }, {
                $set: {
                    lang: lang
                }
            })
        let json = client.cache.get(message.guild.id)
            json.lang = lang
        client.cache.put(message.guild.id, json)
    message.channel.send(client.lang[client.cache.get(message.guild.id).lang][this.name].changed)
        } else {
            let lang = 'ru'
            mongo.guilds.updateOne({
                guildID: message.guild.id
            }, {
                $set: {
                    lang: lang
                }
            })
        let json = client.cache.get(message.guild.id)
            json.lang = lang
        client.cache.put(message.guild.id, json)
    message.channel.send(client.lang[client.cache.get(message.guild.id).lang][this.name].changed)            
        }                
    }
    },
    slash: {
        "name": "language",
        "description": "Change interface language",
        async execute(client, interaction) {
            const { Permissions } = require('discord.js')
            let perms = new Permissions(Number(interaction.member.permissions)).serialize()
                if(!perms['MANAGE_GUILD']) {
                    return client.api.interactions(interaction.id, interaction.token).callback.post({
                        data: {
                            type: 4,
                            data: {
                                flags: 64,
                                content: client.lang[client.cache.get(interaction.guild_id).lang][this.name].noPerms
                            }
                        }
                    })
                }
            const guild = client.cache.get(interaction.guild_id)

            if(guild.lang == 'ru') {
                let lang = 'eng'
            mongo.guilds.updateOne({
                guildID: interaction.guild_id
            }, {
                $set: {
                    lang: lang
                }
            })
        let json = client.cache.get(interaction.guild_id)
            json.lang = lang
        client.cache.put(interaction.guild_id, json)
        client.api.interactions(interaction.id, interaction.token).callback.post({
            data: {
                type: 4,
                data: {
                    content: client.lang[client.cache.get(interaction.guild_id).lang][this.name].changed
                }
            }
        })

            } else {
                    let lang = 'ru'
                mongo.guilds.updateOne({
                    guildID: interaction.guild_id
                }, {
                    $set: {
                        lang: lang
                    }
                })
            let json = client.cache.get(interaction.guild_id)
                json.lang = lang
            client.cache.put(interaction.guild_id, json)
            client.api.interactions(interaction.id, interaction.token).callback.post({
                data: {
                    type: 4,
                    data: {
                        content: client.lang[client.cache.get(interaction.guild_id).lang][this.name].changed
                    }
                }
            })                
            }


        }
      }   
}