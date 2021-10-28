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
        // @ts-ignore
        if(!interaction.member.voice.channel || !interaction.member.voice.channel.id === queue.vc.id)
            return interaction.reply({ content: `Ты не в голосовом канале, либо тот канал, в котором ты находишься не является ключевым для проигрывания`, ephemeral: true });

        queue.player.stopTrack();
        return interaction.reply({ content: `Трек \`${queue.tracks[0].info.title}\` был пропущен!` });
    }
}