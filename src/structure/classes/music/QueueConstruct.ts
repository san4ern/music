import { QueueConstructInterface } from "../../interfaces/music/QueueConstructInterface";
import { QueueConstructOptions } from "../../interfaces/music/QueueConstructOptions";
import { VoiceChannel, TextChannel, Guild, MessageEmbed } from "discord.js";
import { ShoukakuPlayer } from "shoukaku/types/guild/ShoukakuPlayer";
import { ShoukakuTrack } from "shoukaku/types/Constants";
import { MusicBot } from "../Client";

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

export default class QueueConstruct implements QueueConstructInterface {
    guild: Guild;
    loop: { type: 'queue' | 'track' | string, status: boolean };
    player: ShoukakuPlayer;
    tc: TextChannel;
    tracks: ShoukakuTrack[];
    vc: VoiceChannel;
    client: MusicBot

    constructor(options: QueueConstructOptions) {
        this.guild = options.guild;
        this.loop = options.loop;
        this.player = options.player;
        this.tc = options.tc;
        this.tracks = options.tracks;
        this.vc = options.vc;
        this.client = options.client;
    }

    play(track: ShoukakuTrack) {
        if(!track) {
            this.player.connection.disconnect();
            this.client.music.queue.delete(this.guild.id);
        }

        this.player.on('end', async reason => {
            if(reason.reason === 'LOAD_FAILED') {
                this.player.stopTrack();
                return this.tc.send({ content: `Произошла ошибка, при попытке проиграть трек \`${this.tracks[0].info.title}\`, по этому я его пропустил` });
            }

            if(!this.loop.status) {
                this.tracks.shift();
            } else if(this.loop.status && this.loop.type === 'queue') {

                this.tracks.push(this.tracks[0]);
                this.tracks.shift();

            } else if(this.loop.status && this.loop.type === 'track') {}

            if(this.tracks.length) {
                this.player.playTrack(this.tracks[0]);

                const embed = new MessageEmbed()
                    .setAuthor(this.tracks[0].info.author || 'Автор неизвестен')
                    .setTitle(`Сейчас играет: ${this.tracks[0].info.title}`)
                    .setURL(this.tracks[0].info.uri || '')
                    .setColor('#FADC57')
                    .setThumbnail(`https://i.ytimg.com/vi/${this.tracks[0].info.identifier}/hq720.jpg`)
                    .addField('Этап проигрыванния', `${dhm(this.tracks[0].info.position || 0)}/${dhm(this.tracks[0].info.length || 0)}`)
                    .setTimestamp()
                return this.tc.send({ embeds: [embed] })
                    .catch(() => null)
            } else {
                this.player.connection.disconnect();
                this.client.music.queue.delete(this.guild.id);

                return this.tc.send({content: 'Очередь была пуста, поэтому я вышел из голосового канала'})
                    .catch(() => null)
            }

        })
        this.player.on('closed', () => {
            this.player.connection.disconnect();
            this.client.music.queue.delete(this.guild.id);

            return this.tc.send({ content: 'Подключение к плееру было прервано, поэтому я покинул канал' })
                .catch(() => null)
        })

        this.player.playTrack(this.tracks[0]);

        const embed = new MessageEmbed()
            .setAuthor(this.tracks[0].info.author || 'Автор неизвестен')
            .setTitle(`Сейчас играет: ${this.tracks[0].info.title}`)
            .setURL(this.tracks[0].info.uri || '')
            .setColor('#FADC57')
            .setThumbnail(`https://i.ytimg.com/vi/${this.tracks[0].info.identifier}/hq720.jpg`)
            .addField('Этап проигрыванния', `${dhm(this.tracks[0].info.position || 0)}/${dhm(this.tracks[0].info.length || 0)}`)
            .setTimestamp()
        void this.tc.send({ embeds: [embed] })
            .catch(() => null)
    }
}