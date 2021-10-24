import { EventInterface } from "../../interfaces/events/EventInterface";
import { EventOptions } from "../../interfaces/events/EventOptions";
import { MusicBot } from "../Client";

export class Event implements EventInterface {
    name: string;

    constructor(options: EventOptions) {
        this.name = options.name;
    }

    execute(client: MusicBot, ...args: any): any {}

}