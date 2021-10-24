import { Event } from "../structure/classes/events/Event";
import { MusicBot } from "../structure/classes/Client";
import { VoiceState } from "discord.js";

export default class VoiceStateUpdateEvent extends Event {
    constructor() {
        super({
            name: 'voiceStateUpdate'
        });
    }

    execute(client: MusicBot, oldState: VoiceState, newState: VoiceState): any {
        const queue = client.music.queue.get(newState.guild.id);

        if(!queue) return;

        if(queue.vc.members.filter(x => !x.user.bot).size) {
            if(queue.player.paused) {
                queue.player.setPaused(false);
                return queue.tc.send({ content: 'Плеер был возобновлён' });
            }
        }

        if(!queue.vc.members.filter(x => !x.user.bot).size) {
            if(!queue.player.paused) {
                queue.player.setPaused(true);

                setTimeout(() => {
                    if(!queue.vc.members.filter(x => !x.user.bot).size) {
                        queue.player.connection.disconnect();
                        client.music.queue.delete(newState.guild.id);
                        return queue.tc.send({ content: 'Очередь сервера была остановлена, т.к. канал пустовал на протяжении минуты' });
                    }
                }, 60000)

                return queue.tc.send({ content: 'Плеер был поставлен на паузу, т.к. голосовой канал был пустой' });

            }
        }
    }
}