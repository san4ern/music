module.exports = {
    name: 'prefix',
    description: {
        'ru': 'Команда для смены префикса.',
        'eng': 'Prefix-changing command.'
    },
    aliases: ['pref'], 
    args: true,
    usage: '[prefix]',   
    cooldown: 10,
    execute(message, args) {
    if(!message.member.permissions.has('MANAGE_GUILD')) return message.channel.send(
        client.lang[client.cache.get(message.guild.id).lang][this.name].noPerms
    )
            mongo.guilds.updateOne({
                guildID: message.guild.id
            }, {
                $set: {
                    prefix: args[0]
                }
            })
        let json = client.cache.get(message.guild.id)
            json.prefix = args[0]
        client.cache.put(message.guild.id, json)
    message.channel.send(client.lang[client.cache.get(message.guild.id).lang][this.name].changed.replace('%prefix%', args[0]))
        
    }
}