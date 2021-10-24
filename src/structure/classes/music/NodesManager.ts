import { MusicBot } from "../Client";
import { Libraries, Shoukaku } from "shoukaku";
import { NodeOptions } from "shoukaku/types/Constants";
import { Collection, Snowflake } from "discord.js";
import QueueConstruct from "./QueueConstruct";
import { NodesManagerInterface } from "../../interfaces/music/NodesManagerInterface";
import { NodesManagerOptions } from "../../interfaces/music/NodesManagerOptions";

export class NodesManager implements NodesManagerInterface {
    client: MusicBot;
    nodes: NodeOptions[] | [];
    queue: Collection<Snowflake | null, QueueConstruct>;
    shoukaku: Shoukaku;

    constructor(options: NodesManagerOptions) {
        this.client = options.client;
        this.nodes = options.nodes;
        this.queue = new Collection();
        this.shoukaku = new Shoukaku(new Libraries.DiscordJS(this.client), this.nodes, { resumable: true, moveOnDisconnect: true });
        this._keepAlive();
        this._setupShoukakuEvents();
    }

     private _keepAlive() {
        setInterval(() => {
            for(const node of this.nodes) {
                const nodeCheck = this.shoukaku.nodes.get(node.name);
                if(!nodeCheck) {
                    this.shoukaku.addNode(node);
                    console.log(`* [#${this.client.shard?.ids[0] ?? 'BOT'}]\t Shoukaku | ${node.name} | Re-connected!`)
                }
            }
        }, 60000 * 10)
    }

    private _setupShoukakuEvents() {
        this.shoukaku.on('ready', (name) => console.log(`* [#${this.client.shard?.ids[0] ?? 'BOT'}]\t Shoukaku | ${name} | Connected!`));
        this.shoukaku.on('error', (name, error) => console.error(`* [#${this.client.shard?.ids[0] ?? 'BOT'}]\t Shoukaku | ${name} | Error caught | ${error}`));
        this.shoukaku.on('close', (name, code, reason) => console.warn(`* [#${this.client.shard?.ids[0] ?? 'BOT'}]\t Shoukaku | ${name} | Connection closed | Code: ${code}, Reason ${reason || 'No reason'}`));
        this.shoukaku.on('disconnect', (name, reason) => console.warn(`* [#${this.client.shard?.ids[0] ?? 'BOT'}]\t Shoukaku | ${name} | Disconnected | Reason ${reason || 'No reason'}`));
    }
}