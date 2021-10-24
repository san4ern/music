import QueueConstruct from '../../classes/music/QueueConstruct';
import { Collection, Snowflake } from "discord.js";
import { Shoukaku } from "shoukaku";
import { NodeOptions } from "shoukaku/types/Constants";
import { MusicBot } from "../../classes/Client";

export interface NodesManagerInterface {
    shoukaku: Shoukaku;
    queue: Collection<Snowflake | null, QueueConstruct>;
    nodes: NodeOptions[] | [];
    client: MusicBot;
}