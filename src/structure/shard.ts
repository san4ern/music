import { MusicBot } from "./classes/Client";
import 'dotenv/config';

const client = new MusicBot();

process.on('unhandledRejection', reason => {
    console.error(reason);
})
process.on('uncaughtException', error => {
    console.error(error);
})

void client.login(process.env.TOKEN);