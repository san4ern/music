import { SlashCommandBuilder } from "@discordjs/builders";
import Command from '../structure/classes/commands/Command';
import { MusicBot } from "../structure/classes/Client";
import { CommandInteraction } from "discord.js";

export default class StopCommand extends Command {
    constructor() {
        super(
            new SlashCommandBuilder()
                .setName('stop')
                .setDescription('Остановить воспроизведение музыки')
        );
    }

    execute(client: MusicBot, interaction: CommandInteraction) {
        const queue = client.music.queue.get(interaction.guildId);
        if(!queue) return interaction.reply({ content: 'Очередь пуста. Что ты тут хочешь увидеть?', ephemeral: true });
        // @ts-ignore
        if(!interaction.member.voice.channel || !interaction.member.voice.channel.id === queue.vc.id)
            return interaction.reply({ content: `Ты не в голосовом канале, либо тот канал, в котором ты находишься не является ключевым для проигрывания`, ephemeral: true });
        queue.player.stopTrack();
        client.music.queue.delete(interaction.guildId);
        return interaction.reply({ content: 'Очередь сервера была остановлена' })
    }
}