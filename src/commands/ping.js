function average(nums) {
    return nums.reduce((a, b) => (a + b)) / nums.length;
}
module.exports = {
    default: {
    name: 'botstats',
    description: {
        'ru': 'Краткая статистика бота.',
        'eng': 'Average bot ping.'
    },
    aliases: [ 'stats', 'ping', 'bs' ],
    cooldown: 1,
    async execute(message, args) {
    let time = process.hrtime.bigint()
    await mongo.guilds.findOne()
    let db_ping = (parseInt(String(process.hrtime.bigint() - time)) / 1000000).toFixed(3)
    const m = await message.channel.send('Pinging...')
    let reply = `🔄 **Websocket**: ${client.ws.ping}ms\n🔄 **Average Websocket**: ${average(client.ping)}ms\n🔄 **API**: ${m.createdTimestamp - message.createdTimestamp}ms\n🔄 **Database**: ${db_ping}ms\n` 
    if (message.author.id == '607148903833403422') {
        reply += `⚙️ **CPU usage**: ${(average(require('os').loadavg())).toFixed(0)}%\n⚙️ **RAM**: ${(process.memoryUsage().heapUsed / 1024 ** 2).toFixed(0)}MB`
    }
    m.edit(reply)
    }
    },
    slash: {
        "name": "stats",
        "description": "Bot-statistics command",
        async execute(client, interaction, args) {
            let preTime = Date.now()
            let time = process.hrtime.bigint()
            await mongo.guilds.findOne()
            let db_ping = (parseInt(String(process.hrtime.bigint() - time)) / 1000000).toFixed(3)
            let reply = `🔄 **Websocket**: ${client.ws.ping}ms\n🔄 **Average Websocket**: ${average(client.ping)}ms\n🔄 **API**: ${Date.now() - preTime}ms\n🔄 **Database**: ${db_ping}ms`
            client.api.interactions(interaction.id, interaction.token).callback.post({
				data: {
					type: 4,
					data: {
						content: reply,
                        flags: 64
					}
				}
        })
    }
      }
}