import { SlashCommandBuilder } from "@discordjs/builders";
import Command from '../structure/classes/commands/Command';
import { MusicBot } from "../structure/classes/Client";
import { CommandInteraction, MessageEmbed } from "discord.js";

function dhm(ms: number){
    let days = Math.floor(ms / (24 * 60 * 60 * 1000)) || '00';
    const daysms = ms % (24 * 60 * 60 * 1000);
    let hours = Math.floor((daysms)/(60 * 60 * 1000)) || '00';
    const hoursms = ms % (60 * 60 * 1000);
    let minutes = Math.floor((hoursms)/(60 * 1000)) || '00';
    const minutesms = ms % (60 * 1000);
    let sec = Math.floor((minutesms)/(1000)) || '00';
    let str = '';
    if(days !== '00') str += `${days}:`;
    if(hours !== '00') str += `${hours}:`;

    return str + minutes + ":" + sec;
}

export default class QueueCommand extends Command {
    constructor() {
        super(
            new SlashCommandBuilder()
                .setName('queue')
                .setDescription('Получить очередь сервера')
        );
    }

    execute(client: MusicBot, interaction: CommandInteraction) {
        const queue = client.music.queue.get(interaction.guildId);
        if(!queue) return interaction.reply({ content: 'Очередь пуста. Что ты тут хочешь увидеть?', ephemeral: true });

        let queueStr = '', i = 1;
        for(const track of queue.tracks) {
            queueStr += `[\`#${i}\`] **${track.info.author}** - ${track.info.title}. \`(${dhm(track.info.length ?? 0)})\`\n`;
            i++;
        }

        const embed = new MessageEmbed()
            .setTitle(`Очередь сервера ${interaction.guild?.name}`)
            .setColor('#FADC57')
            .setThumbnail(interaction.guild?.iconURL({ size: 1024, dynamic: true }) ?? '')
            .setDescription(queueStr)
            .addField('Сейчас играет', `**${queue.tracks[0].info.author}** - ${queue.tracks[0].info.title}. \`(${dhm(queue.player.position)}/${dhm(queue.tracks[0].info.length ?? 0)})\``)
            .setTimestamp()

        return interaction.reply({ embeds: [embed] });
    }
}