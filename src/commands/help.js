module.exports = {
    name: 'help',
    description: 'Help command.',
    cooldown: 1,
    execute(message, args) {
        const { commands } = message.client
        const msg = '**List of commands**:\n' + commands.filter(x => !x.secret).map(x => `**${x.name}** - ${x.description}\n`).join('')
        message.channel.send(msg)        
    }
}