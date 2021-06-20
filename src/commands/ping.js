module.exports = {
    name: 'botstats',
    description: 'Average bot ping.',
    aliases: [ 'stats', 'ping', 'bs' ],
    cooldown: 1,
    async execute(message, args) {
        function average(nums) {
            return nums.reduce((a, b) => (a + b)) / nums.length;
        }
        const m = await message.channel.send('Pinging...')
        m.edit(`🔄 **Websocket**: ${message.client.ws.ping}ms\n🔄 **Average Websocket**: ${average(message.client.ping)}ms\n🔄 **API**: ${m.createdTimestamp - message.createdTimestamp}ms`)
    }
}