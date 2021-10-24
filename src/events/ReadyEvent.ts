import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { MusicBot } from "../structure/classes/Client";
import { Event } from "../structure/classes/events/Event";

export default class ReadyEvent extends Event {
    constructor() {
        super({
            name: 'ready'
        });
    }

    execute(client: MusicBot): any {
        const rest = new REST({version: '9'}).setToken(process.env.TOKEN ?? '');
        const clientId = client.user?.id;

        (async () => {
            try {
                console.log(`* [#${client.shard?.ids[0] ?? 'BOT'}]\t Commands | ♻ Refreshing slashes`);
                await rest.put(
                    // @ts-ignore
                    Routes.applicationCommands(clientId),
                    { body: client.commands.map(x => x.data.toJSON()) },
                );

                console.log(`* [#${client.shard?.ids[0] ?? 'BOT'}]\t Commands | ✅ Refreshed slashes`);
            } catch (error) {
                console.error(error);
            }
        })();
    }
};