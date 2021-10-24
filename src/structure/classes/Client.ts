import { Client, Intents, Collection, LimitedCollection } from "discord.js";
import { readdirSync } from 'fs';
import Command from './commands/Command';
import { Event } from "./events/Event";
import { NodesManager } from "./music/NodesManager";

export class MusicBot extends Client {
    music: NodesManager;
    declare commands: Collection<string, Command>;

    constructor() {
        super({
            allowedMentions: { parse: ['users'], repliedUser: false },
            makeCache: (manager) => {
                switch (manager.name) {
                    case 'GuildBanManager':
                    case 'GuildInviteManager':
                    case 'GuildStickerManager':
                    case 'PresenceManager':
                    case 'ThreadManager': return new LimitedCollection({maxSize: 0});
                    case 'MessageManager': return new LimitedCollection({maxSize: 5, sweepInterval: 200});
                    default: return new Collection();
                }
            },
            presence: { status: "idle", activities: [{ name: `to slash`, type: "LISTENING"}] },
            intents: [ Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES ]
        });

        this.music = new NodesManager({ client: this, nodes: require('../../configs/nodes').default })
        this.commands = new Collection();
    }
    login(token: any) {
        void this._loadCommands();
        void this._loadEvents();
        return super.login(token);
    }

    private async _loadCommands() {
        try {
            for (const file of readdirSync('./dist/commands').filter(x => x.endsWith('.js'))) {
                const command: any = await import(`../../commands/${file}`);
                const cmd: Command = new (command.default)();

                this.commands.set(cmd.data.name, cmd);
                console.log(`* [#${this.shard?.ids[0] ?? 'BOT'}]\t Commands | Loaded ${cmd.data.name} command`);
            }
        } catch (e) {
            console.warn(`* [#${this.shard?.ids[0] ?? 'BOT'}]\t Commands | Got an error:\n${e}`)
        }
    }

    private async _loadEvents() {
        try {
            for (const file of readdirSync('./dist/events')) {
                const eventFile: any = await import(`../../events/${file}`);
                const event: Event = new (eventFile.default)();

                this.on(event.name, (...args) => {
                    event.execute(this, ...args);
                })

                console.log(`* [#${this.shard?.ids[0] ?? 'BOT'}]\t Events | Loaded ${event.name} event`);
            }
        } catch (e) {
            console.warn(`* [#${this.shard?.ids[0] ?? 'BOT'}]\t Events | Got an error:\n${e}`)
        }
    }
}