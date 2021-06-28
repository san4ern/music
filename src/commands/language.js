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
    }   
}