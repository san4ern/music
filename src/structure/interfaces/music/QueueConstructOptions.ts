import { VoiceChannel, TextChannel, Guild } from "discord.js";
import { ShoukakuPlayer } from "shoukaku/types/guild/ShoukakuPlayer";
import { ShoukakuTrack } from "shoukaku/types/Constants";
import { MusicBot } from "../../classes/Client";

export interface QueueConstructOptions {
    vc: VoiceChannel;
    tc: TextChannel;
    player: ShoukakuPlayer;
    tracks: ShoukakuTrack[] | [];
    loop: { type: 'queue' | 'track', status: boolean };
    guild: Guild;
    client: MusicBot;
}