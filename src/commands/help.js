module.exports = {
    name: 'help',
    description: 'Help command.',
    aliases: ['h'],    
    cooldown: 1,
    execute(message, args) {
        const { commands } = message.client
        const msg = '**List of commands**\nCommand\'s listed bellow in form:\n`name[aliases] - description`\n' + commands.filter(x => !x.secret).map(x => `**${x.name}[${x.aliases.join(', ') ? x.aliases.join(', ') : 'Nothing'}]** - ${x.description}\n`).join('')
        message.channel.send(msg)        
    }
}