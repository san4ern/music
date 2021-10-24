import { VoiceChannel, TextChannel, Guild } from "discord.js";
import { ShoukakuPlayer } from "shoukaku/types/guild/ShoukakuPlayer";
import { ShoukakuTrack } from "shoukaku/types/Constants";
import { MusicBot } from "../../classes/Client";

export interface QueueConstructInterface {
    vc: VoiceChannel;
    tc: TextChannel;
    player: ShoukakuPlayer;
    tracks: ShoukakuTrack[];
    loop: { type: 'queue' | 'track' | string, status: boolean };
    guild: Guild;
    client: MusicBot;


    play(track: ShoukakuTrack): any
}