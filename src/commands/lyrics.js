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
        const length = 1900; // длина одной части
        const pattern = new RegExp(".{1," + length + "}", "g");
        let res = text.match(/(.|[\r\n]){1,1900}/g);
        let i = 1
        const msg = `**💬 ${found.title}'s lyrics**:\n${res[0]}`
        const responce = await message.channel.send(msg)
            .then(m => {
                if(res.length > 1) {
                    m.react('➡️')
                    const filter = (reaction, user) => {
                        return ['➡️'].includes(reaction.emoji.name) && user.id === message.author.id;
                    };
            const collector = m.createReactionCollector(filter, { max: res.length - 1, time: 15000 });
            collector.on('collect', (reaction, user) => {
                console.log(reaction)
                if(reaction.emoji.name == '➡️') {
                    m.edit(`**💬 ${found.title}'s lyrics**:\n${res[i]}`)
                    i++
                    
                }
            })
            collector.on('end', () => {
            if(message.guild.me.permissions.has('MANAGE_MESSAGES')){
                m.reactions.removeAll()
            }})
                }
                
        })


        } catch {
        message.channel.send('❌ No lyrics was found by specified query. Try another one')
        }
    }
}