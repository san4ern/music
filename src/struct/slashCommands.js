const { DiscordInteractions } = require("slash-commands");
const { readdirSync } = require('fs');
const { join } = require('path');
module.exports = {
    async slash(client) {
        global.interaction = new DiscordInteractions({
            applicationId: "855801266613518356",
            authToken: "ODU1ODAxMjY2NjEzNTE4MzU2.YM3xCQ.I5hLcEEIwvqcKlItCRbhXW7YxmU",
            publicKey: "88c187f90ea9fb2f8541c16778a6086c19f1ec5d8abfe998a4095e3223cbad06",
          });
const commandFiles = readdirSync('./src/commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    
        const cmd = require(`../commands/${file}`);
    if(cmd.slash) {
        client.slashCommands.set(cmd.slash.name, cmd.slash);
            await interaction
            .createApplicationCommand(cmd.slash)
            .then(console.log)
            .catch(console.error.errors);
    }
	
	
}
          client.ws.on('INTERACTION_CREATE', async interaction => {
      const command = interaction.data.name.toLowerCase();
      const args = interaction.data.options;
    client.slashCommands.get(command).execute(client, interaction, args)
  });
    }
}