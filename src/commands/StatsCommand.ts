import { SlashCommandBuilder } from "@discordjs/builders";
import Command from '../structure/classes/commands/Command';
import { MusicBot } from "../structure/classes/Client";
import { CommandInteraction, MessageEmbed } from "discord.js";

export default class StatsCommand extends Command {
    constructor() {
        super(
            new SlashCommandBuilder()
                .setName('stats')
                .setDescription('Получить статистику бота')
                .addSubcommand(command => {
                        return command
                            .setName('nodes')
                            .setDescription('Вернёт статистику музыкальных серверов бота')
                    }
                )
                .addSubcommand(command => {
                    return command
                        .setName('bot')
                        .setDescription('Вернёт краткую статистику бота')
                })
        );
    }

    async execute(client: MusicBot, interaction: CommandInteraction) {
        const command = interaction.options.getSubcommand();

        switch (command) {
            case 'bot': {
                let users: any, guilds: any, pings: any, ram: any, members: any;
                let ping = '';
                await Promise.all([
                    client.shard?.fetchClientValues('users.cache.size'),
                    client.shard?.fetchClientValues('guilds.cache.size'),
                    client.shard?.broadcastEval(c => c.ws.ping),
                    client.shard?.broadcastEval(() => process.memoryUsage().rss),
                    client.shard?.broadcastEval(c => c.guilds.cache.reduce((a, b) => a + b.memberCount, 0))
                ])
                    .then(results => {
                        users = results[0];
                        guilds = results[1];
                        pings = results[2];
                        ram = results[3];
                        members = results[4];
                    })

                for(let i = 0; i < 25; i++) {
                    if(!pings[i]) break;
                    ping += `**Осколок: #${i}**\nЗадержка: ${pings[i]}ms\nПользователи в кеше: ${users[i]}/${members[i]}\nСервера: ${guilds[i]}\nПотребление ОЗУ: ${~~(ram[i] / 1024 ** 2)}MB\n`
                }

                const node = client.music.shoukaku.getNode();
                const embed = new MessageEmbed()
                    .setTitle(`Статистика бота ${client.user?.tag}`)
                    .setColor('#FADC57')
                    .setThumbnail(client.user?.displayAvatarURL({ size: 1024 }) ?? '')
                    .addField(
                        'Числа',
                        `Пользователи в кеше: ${users.reduce((acc: any, memberCount: any) => acc + memberCount, 0)}/${members.reduce((acc: any, memberCount: any) => acc + memberCount, 0)}\nСервера в кеше: ${guilds.reduce((acc: any, guildCount: any) => acc + guildCount, 0)}\nСредняя задержка: ${client.ws.ping}ms\nПотребление ОЗУ: ${~~(ram.reduce((acc: any, ram: any) => acc + ram, 0) / 1024 ** 2)}MB`,
                        true
                    )
                    .setTimestamp()

                    if(node) {
                        embed.addField(
                            `Муз. сервер: ${node.name}`,
                            `ОЗУ: ${~~(node.stats.memory.used / 1024 ** 2)}/${~~(node.stats.memory.allocated / 1024 ** 2)}MB\nКоличество плееров: ${node.players.size}/${node.stats.players}`,
                            true
                        )
                    }

                const embed2 = new MessageEmbed()
                    .setTitle('Статистика шардов')
                    .setDescription(ping)
                    .setColor('#FADC57')
                    .setThumbnail(client.user?.displayAvatarURL({ size: 1024 }) ?? '')
                    .setTimestamp()

                return interaction.reply({ embeds: [embed, embed2] })
                    .catch(() => null);
            }
            case 'nodes': {
                const nodes = client.music.shoukaku.nodes;

                const embed = new MessageEmbed()
                    .setTitle('Статистика музыкальных серверов')
                    .setColor('#FADC57')
                    .setThumbnail(client.user?.displayAvatarURL({ size: 1024 }) ?? '')
                    .setTimestamp()

                for (const node of nodes) {
                    embed
                        .addField(
                            `${node[1].group} | ${node[1].name} | [${node[1].state}]`,
                            `ОЗУ: ${~~(node[1].stats.memory.used / 1024 ** 2)}/${~~(node[1].stats.memory.allocated / 1024 ** 2)}MB\nКоличество плееров: ${node[1].players.size}/${node[1].stats.players}`,
                            true
                        )
                }

                return interaction.reply({ embeds: [embed] })
                    .catch(() => null);
            }
        }

    }
}