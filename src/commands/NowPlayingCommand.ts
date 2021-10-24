import { SlashCommandBuilder } from "@discordjs/builders";
import Command from '../structure/classes/commands/Command';
import { MusicBot } from "../structure/classes/Client";
import { CommandInteraction, MessageEmbed, MessageButton, MessageActionRow, ButtonInteraction, Message } from "discord.js";

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

export default class NowPlayingCommand extends Command {
    constructor() {
        super(
            new SlashCommandBuilder()
                .setName('nowplaying')
                .setDescription('Узнать песню которая сейчас проигрывает')
        );
    }

    async execute(client: MusicBot, interaction: CommandInteraction) {
        const queue = client.music.queue.get(interaction.guildId);
        if(!queue) return interaction.reply({ content: 'Очередь пуста. Что ты тут хочешь увидеть?', ephemeral: true });

        await interaction.deferReply();

        let loop;
        if(!queue.loop.type) {
            loop = '❎';
        } else {
            loop = queue.loop.status && queue.loop?.type === 'queue' ? '🔁' : '🔂';
        }

        const row = new MessageActionRow()
            .addComponents(
                [
                    new MessageButton()
                        .setCustomId('pause')
                        .setLabel('Статус')
                        .setEmoji(!queue.player.paused ? '▶' : '⏸')
                        .setStyle('PRIMARY'),
                    new MessageButton()
                        .setCustomId('loop')
                        .setLabel('Повтор')
                        .setEmoji(loop)
                        .setStyle('SECONDARY')
                ]
            )
        const embed = new MessageEmbed()
            .setAuthor(queue.tracks[0].info.author || 'Автор неизвестен')
            .setTitle('Сейчас играет')
            .setColor('#FADC57')
            .setThumbnail(`https://i.ytimg.com/vi/${queue.tracks[0].info.identifier}/hq720.jpg`)
            .setTimestamp()
            .setDescription(`[${queue.tracks[0].info.author} - ${queue.tracks[0].info.title}](${queue.tracks[0].info.uri})\n\`(${dhm(queue.player.position)}/${dhm(queue.tracks[0].info.length ?? 0)})\``)

        const reply = await interaction.editReply({ embeds: [embed], components: [row] });
        const filter = (i: ButtonInteraction) => i.user.id === interaction.user.id;

        console.log(reply instanceof Message)
        if (reply instanceof Message) {
            const collector = reply.createMessageComponentCollector({ componentType: 'BUTTON', filter, time: 15000 });

            collector.on('collect', async (i: ButtonInteraction) => {
                console.log(i)
                if(!i.isButton()) return;
                const queue = client.music.queue.get(i.guildId);
                if (!queue) return i.reply({ content: 'Очередь сервера пуста, так что смысл от кнопок отсутствует', ephemeral: true });

                if(i.customId === 'pause') {
                    await i.deferReply({ ephemeral: true });
                    switch (queue.player.paused) {
                        case true: {
                            queue.player.setPaused(false);

                            let loop;
                            if(!queue.loop.type) {
                                loop = '❎';
                            } else {
                                loop = queue.loop.status && queue.loop?.type === 'queue' ? '🔁' : '🔂';
                            }
                            const row = new MessageActionRow()
                                .addComponents(
                                    [
                                        new MessageButton()
                                            .setCustomId('pause')
                                            .setLabel('Статус')
                                            .setEmoji(!queue.player.paused ? '▶' : '⏸')
                                            .setStyle('PRIMARY'),
                                        new MessageButton()
                                            .setCustomId('loop')
                                            .setLabel('Повтор')
                                            .setEmoji(loop)
                                            .setStyle('SECONDARY')
                                    ]
                                )
                            i.update({ components: [row] });
                            i.editReply({ content: 'Очередь сервера была возобновлена' });
                        }
                        break;
                        case false: {
                            queue.player.setPaused(true);

                            let loop;
                            if(!queue.loop.type) {
                                loop = '❎';
                            } else {
                                loop = queue.loop.status && queue.loop?.type === 'queue' ? '🔁' : '🔂';
                            }
                            const row = new MessageActionRow()
                                .addComponents(
                                    [
                                        new MessageButton()
                                            .setCustomId('pause')
                                            .setLabel('Статус')
                                            .setEmoji(!queue.player.paused ? '▶' : '⏸')
                                            .setStyle('PRIMARY'),
                                        new MessageButton()
                                            .setCustomId('loop')
                                            .setLabel('Повтор')
                                            .setEmoji(loop)
                                            .setStyle('SECONDARY')
                                    ]
                                )
                            i.update({ components: [row] });
                            i.editReply({ content: 'Очередь сервера была остановлена' });
                        }
                        break;
                    }
                }
            })
        }
    }
}

