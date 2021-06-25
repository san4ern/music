module.exports = async(client) => {
    console.log('READY!')
	setTimeout(async () => {
		client.ping.push(client.ws.ping)

		const guilds = client.guilds.cache.map(x => x.id)
		for(const guild of guilds) {
			let monguild = await mongo.guilds.findOne({
				guildID: guild
			})
			const json = {
				lang: monguild.lang,
				prefix: monguild.prefix
			}
			client.cache.put(guild, json)
		}
	}, 3000)

	setInterval(() => {
	if(client.ping.length != 5) {
		client.ping.push(client.ws.ping)
	} else {
		client.ping.splice(0, 1)
		client.ping.push(client.ws.ping)
	}		
	}, 300000)
	
	client.user.setPresence({ activity: { name: 'm/', type: 'LISTENING' }, status: 'idle' })
		
}