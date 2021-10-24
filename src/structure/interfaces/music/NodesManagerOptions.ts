import { MusicBot } from "../../classes/Client";
import { NodeOptions } from "shoukaku/types/Constants";

export interface NodesManagerOptions {
    client: MusicBot;
    nodes: NodeOptions[] | [];
}