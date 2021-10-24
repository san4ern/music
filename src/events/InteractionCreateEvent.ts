import { Interaction } from "discord.js";
import { Event } from "../structure/classes/events/Event";
import { MusicBot } from "../structure/classes/Client";

export default class InteractionCreateEvent extends Event {
    constructor() {
        super({
            name: 'interactionCreate'
        });
    }

    execute(client: MusicBot, interaction: Interaction): any {
        if(!interaction.inGuild()) return;

        if(interaction.isCommand()) {
            const command = client.commands.get(interaction.commandName);

            if(!command) return;
            command.execute(client, interaction);
        }
    }
};