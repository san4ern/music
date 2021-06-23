module.exports = async(client) => {
    console.log('READY!')
	setTimeout(() => {
		client.ping.push(client.ws.ping)
	}, 1000)

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