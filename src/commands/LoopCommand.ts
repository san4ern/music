import { MusicBot } from "../structure/classes/Client";
import { CommandInteraction } from "discord.js";
import Command from '../structure/classes/commands/Command';
import { SlashCommandBuilder } from "@discordjs/builders";

export default class LoopCommand extends Command {
    constructor() {
        super(
            new SlashCommandBuilder()
                .setName('loop')
                .setDescription('Запустить повторное проигрыванние текущей песни либо очереди')
                .addBooleanOption(option => {
                    return option
                        .setName('status')
                        .setDescription('Введите true, чтобы включить повтор и соответственно false, чтобы отключить')
                })
                .addStringOption(option => {
                    return option
                        .setName('type')
                        .setDescription('Выберите тип повторения')
                        .addChoice('очередь', 'queue')
                        .addChoice('трек', 'track')
                })
        );
    }

    execute(client: MusicBot, interaction: CommandInteraction) {
        const queue = client.music.queue.get(interaction.guildId);

        if(!queue) return interaction.reply({ content: 'Очередь и без того пуста - мне нечего повторять!', ephemeral: true });

        const type = interaction.options.getString('type') || 'track';
        const status = interaction.options.getBoolean('status') || !queue?.loop.status;
        queue.loop.type = type; queue.loop.status = status;

        return interaction.reply({ content: `Было ${queue.loop.status ? 'запущено' : 'отключено'} повторное проигрывание ${queue.loop.type === 'track' ? 'трека' : 'очереди'}` });
    }
}