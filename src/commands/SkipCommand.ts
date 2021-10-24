import { MusicBot } from "../structure/classes/Client";
import { CommandInteraction } from "discord.js";
import Command from '../structure/classes/commands/Command';
import { SlashCommandBuilder } from "@discordjs/builders";

export default class SkipCommand extends Command {
    constructor() {
        super(
            new SlashCommandBuilder()
                .setName('skip')
                .setDescription('Пропустить текущую песню')
        );
    }

    execute(client: MusicBot, interaction: CommandInteraction) {
        const queue = client.music.queue.get(interaction.guildId);

        if(!queue || !queue.tracks.length) {
            return interaction.reply({ content: 'Очередь сервера пуста. Что мне пропускать?', ephemeral: true });
        }

        queue.player.stopTrack();
        return interaction.reply({ content: `Трек \`${queue.tracks[0].info.title}\` был пропущен!` });
    }
}