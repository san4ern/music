module.exports = {
    default: {
    name: 'botstats',
    description: {
        'ru': 'Краткая статистика бота.',
        'eng': 'Average bot ping.'
    },
    aliases: [ 'stats', 'ping', 'bs' ],
    cooldown: 1,
    async execute(message, args) {function average(nums) {
        return nums.reduce((a, b) => (a + b)) / nums.length;
    }
    let time = process.hrtime.bigint()
    await mongo.guilds.findOne()
    let db_ping = (parseInt(String(process.hrtime.bigint() - time)) / 1000000).toFixed(3)
    const m = await message.channel.send('Pinging...')
    let reply = `🔄 **Websocket**: ${message.client.ws.ping}ms\n🔄 **Average Websocket**: ${average(message.client.ping)}ms\n🔄 **API**: ${m.createdTimestamp - message.createdTimestamp}ms\n🔄 **Database**: ${db_ping}ms\n` 
    if (message.author.id == '607148903833403422') {
        reply += `⚙️ **CPU usage**: ${(average(require('os').loadavg())).toFixed(0)}%\n⚙️ **RAM**: ${(process.memoryUsage().heapUsed / 1024 ** 2).toFixed(0)}MB`
    }
    m.edit(reply)
    }
    }
}