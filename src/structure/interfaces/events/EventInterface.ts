import { MusicBot } from "../../classes/Client";

export interface EventInterface {
        name: string,
        execute(client: MusicBot, ...args: any): any
}