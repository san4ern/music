const Genius = require("genius-lyrics");
const lyrics = new Genius.Client(process.env.LYRICS_KEY);

module.exports = {
    name: 'lyrics',
    description: 'Lyrics-search command.',
	aliases: ['l', 'text'],
	cooldown: 3,
    async execute(message, args) {
        try {
            const search = await lyrics.songs.search(args.join(' '))
        const found = search[0]

        const text = await found.lyrics()
        const lyricsMessage = text.slice(0, 1900)
        const msg = `**💬 ${found.title}'s lyrics**:\n${lyricsMessage}`
        message.channel.send(msg)
        } catch {
        message.channel.send('❌ No lyrics was found by specified query. Try another one')
        }
    }
}