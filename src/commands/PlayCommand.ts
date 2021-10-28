import { SlashCommandBuilder } from "@discordjs/builders";
import Command from '../structure/classes/commands/Command';
import { MusicBot } from "../structure/classes/Client";
import { CommandInteraction } from "discord.js";
import QueueConstruct from '../structure/classes/music/QueueConstruct';
import { getPreview } from 'spotify-url-info';

export default class PlayCommand extends Command {
    constructor() {
        super(
            new SlashCommandBuilder()
                .setName('play')
                .setDescription('Запустить проигрывание песни')
                .addStringOption(option => {
                    return option
                        .setName('query')
                        .setDescription('Найти указанную аудиозапись')
                        .setRequired(true)
                })
        );
    }

    async execute(client: MusicBot, interaction: CommandInteraction) {
        // @ts-ignore
        if(!interaction.member || !interaction.member.voice || !interaction.member?.voice.channel) {
            return interaction.reply({ content: 'Ты не в голосовом канале!' })
        }
        let input = interaction.options.get('query') || { value: '' }, search = 'youtube';
        const spotifyRegex = new RegExp(`(https?:\\/\\/open.spotify.com\\/(track|user|artist|album)\\/[a-zA-Z0-9]+(\\/playlist\\/[a-zA-Z0-9]+|)|spotify:(track|user|artist|album):[a-zA-Z0-9]+(:playlist:[a-zA-Z0-9]+|))`);
        const res = spotifyRegex.exec(String(input.value));
        if(res) {
            const track = await getPreview(res[0]);
            input = { value: `${track.artist} - ${track.title}` };
        }

        await interaction.deferReply();
        const node = client.music.shoukaku.getNode();
        const tracks = await node.rest.resolve(String(input.value), search);

        if(!tracks) {
            return interaction.editReply({ content: 'Ничего не было найдено по данному запросу' })
        }

        if(tracks?.type === 'PLAYLIST') {
            const songs = tracks.tracks;
            if(!songs.length) {
                return interaction.editReply({ content: 'Ничего не было найдено по данному запросу' })
            }
            const queueSearch = client.music.queue.get(interaction.guildId);
            if(!queueSearch) {
                const player = await node.joinChannel({
                    guildId: interaction.guild?.id ?? '',
                    shardId: client.shard?.ids[0] ?? 0,
                    // @ts-ignore
                    channelId: interaction.member?.voice.channel.id
                })

                // @ts-ignore
                const queue = new QueueConstruct({vc: interaction.member?.voice.channel, tc: interaction.channel, client: client, player: player, tracks: songs, loop: { type: undefined, status: false }, guild: interaction.guild});
                client.music.queue.set(interaction.guildId, queue);
                queue.play(queue.tracks[0]);
            } else {
                for (const track of songs) {
                    queueSearch.tracks.push(track);
                }

            }
            return interaction.editReply({ content: `Плейлист \`${tracks.playlistName}\` был добавлен в очередь воспроизведения!` })
        }
        if(tracks?.type === 'SEARCH' || tracks?.type === 'TRACK') {
            if(!tracks.tracks.length) {
                return interaction.editReply({ content: 'Ничего не было найдено по данному запросу' })
                    .catch(() => null);
            }
            const songs = [ tracks.tracks[0] ];

            const queueSearch = client.music.queue.get(interaction.guildId);
            if(!queueSearch) {
                const player = await node.joinChannel({
                    guildId: interaction.guild?.id ?? '',
                    shardId: client.shard?.ids[0] ?? 0,
                    // @ts-ignore
                    channelId: interaction.member?.voice.channel.id
                })

                // @ts-ignore
                const queue = new QueueConstruct({ vc: interaction.member?.voice.channel, tc: interaction.channel, client: client, player: player, tracks: songs, loop: { type: undefined, status: false }, guild: interaction.guild});
                client.music.queue.set(interaction.guildId, queue);
                queue.play(queue.tracks[0]);
            } else {
                queueSearch.tracks.push(songs[0]);
            }

            return interaction.editReply({ content: `Песня \`${songs[0].info.title}\` была добавлена в очередь воспроизведения!` })
                .catch(() => null);
        }
        if(tracks?.type === 'LOAD_FAILED' || tracks?.type === 'NO_MATCHES') {
            return interaction.editReply({ content: 'Ничего не было найдено по данному запросу' })
                .catch(() => null);
        }
    }
}