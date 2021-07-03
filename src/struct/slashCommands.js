const { DiscordInteractions } = require("slash-commands");
const { readdirSync } = require('fs');
const { join } = require('path');
const { sleep } = require('sleep')
module.exports = {
    async slash(client) {
        global.interaction = new DiscordInteractions({
            applicationId: "855801266613518356",
            authToken: "ODU1ODAxMjY2NjEzNTE4MzU2.YM3xCQ.I5hLcEEIwvqcKlItCRbhXW7YxmU",
            publicKey: "88c187f90ea9fb2f8541c16778a6086c19f1ec5d8abfe998a4095e3223cbad06",
          });
const commandFiles = readdirSync('./src/commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    
    const command = require(`../commands/${file}`);

    if(command.slash) {
    client.slashCommands.set(command.slash.name, command.slash);
        await interaction
        .createApplicationCommand(command.slash)
        .then(console.log)
        .catch(console.error.errors);
        sleep(3)
    }
    
	
}
          client.ws.on('INTERACTION_CREATE', async interaction => {
      const command = interaction.data.name.toLowerCase();
      const args = interaction.data.options;
    client.slashCommands.get(command).execute(client, interaction, args)
  });
    }
}