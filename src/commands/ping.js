module.exports = {
    name: 'botstats',
    description: 'Average bot ping.',
    aliases: [ 'stats', 'ping', 'bs' ],
    cooldown: 1,
    async execute(message, args) {function average(nums) {
        return nums.reduce((a, b) => (a + b)) / nums.length;
    }
    
    const m = await message.channel.send('Pinging...')
    let reply = `🔄 **Websocket**: ${message.client.ws.ping}ms\n🔄 **Average Websocket**: ${average(message.client.ping)}ms\n🔄 **API**: ${m.createdTimestamp - message.createdTimestamp}ms\n` 
    if (message.author.id == '607148903833403422') {
        reply += `⚙️ **CPU usage**: ${(average(require('os').loadavg())).toFixed(0)}%\n⚙️ **RAM**: ${(process.memoryUsage().heapUsed / 1024 ** 2).toFixed(0)}MB`
    }
    m.edit(reply)
    }
}