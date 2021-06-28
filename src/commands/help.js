module.exports = {
    default: {
    name: 'help',
    description: {
        'ru': 'Команда, выводящая список команд.',
        'eng': 'Help command.'
    },
    aliases: ['h'],    
    cooldown: 1,
    execute(message, args) {
        const { commands } = message.client
        const msg = client.lang[client.cache.get(message.guild.id).lang][this.name].list + commands.filter(x => !x.secret).map(x => `**${x.name}** - ${x.description[client.cache.get(message.guild.id).lang]}\n`).join('')
        message.channel.send(msg)        
    }
    }
}