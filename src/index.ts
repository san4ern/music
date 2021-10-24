import { ShardingManager } from "discord.js";
import 'dotenv/config';

const manager = new ShardingManager('./dist/structure/shard.js', { token: process.env.TOKEN });

process.on('unhandledRejection', reason => {
    console.error(reason);
})
process.on('uncaughtException', error => {
    console.error(error);
})
manager.on('shardCreate', (shard) => { console.log(`* [#${shard.id}]\t Logged in`) })

void manager.spawn();