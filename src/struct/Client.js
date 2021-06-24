const { Client, Collection } = require('discord.js');

module.exports = class extends Client {
	constructor(config) {
		super({
			disableMentions: 'everyone',
			messageCacheMaxSize: 5,
			messageCacheLifetime: 300,
			messageSweepInterval: 1000,
			messageEditHistoryMaxSize: 1
		});
		this.ping = []
		this.commands = new Collection();
		this.cooldowns = new Collection();
		this.queue = new Map();
		this.config = config;
	}
};