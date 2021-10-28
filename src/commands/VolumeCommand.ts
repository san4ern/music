import { SlashCommandBuilder } from "@discordjs/builders";
import Command from '../structure/classes/commands/Command';
import { MusicBot } from "../structure/classes/Client";
import { CommandInteraction } from "discord.js";

export default class VolumeCommand extends Command {
    constructor() {
        super(
            new SlashCommandBuilder()
                .setName('volume')
                .setDescription('Команда чтобы сменить уровень громкости очереди на сервере')
                .addIntegerOption(option => {
                    return option
                        .setName('level')
                        .setDescription('Уровень громкости который необходимо установить')
                        .setRequired(true)
                })
        );
    }

    execute(client: MusicBot, interaction: CommandInteraction) {
        const queue = client.music.queue.get(interaction.guildId);
        if(!queue) return interaction.reply({ content: 'Очередь пуста. Что ты тут хочешь увидеть?', ephemeral: true });
        let volume: number | { type: number, amount: number }  = interaction.options.getInteger('level') || 0;
        if(volume < 0) volume = { type: 0, amount: 0 };
        if(volume > 200) volume = { type: 1, amount: 200 };

        queue.player.setVolume(typeof volume === 'object' ? volume.type ? 200 : 0 : volume);
        return interaction.reply({
            content: typeof volume === 'object'
                ? volume.type
                    ? 'Указанная громкость выходит за рамки разрешённой (0;200), поэтому я поставил 200, как максимально возможную'
                    : 'Указанная громкость меньше, чем рамки разрешённой (0;200), поэтому я поставил 0, как минимально возможную'
                : `Громкость плеера была изменена на ${volume}`
        });
    }
}