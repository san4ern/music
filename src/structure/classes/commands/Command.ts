import { MusicBot } from "../Client";
import { CommandInteraction } from "discord.js";
import { SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder } from "@discordjs/builders";

export default class Command {
    readonly data: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder | any;

    constructor(options: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder | any) {
        this.data = options;
    }
    execute(client: MusicBot, interaction: CommandInteraction): any {};
}