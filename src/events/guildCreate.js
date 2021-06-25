module.exports = async(guild) => {
    const monguild = await mongo.guilds.findOne({
        guildID: guild.id
    })   
        if(!monguild) {
            mongo.guilds.insertOne({
                guildID: guild.id,
                prefix: null,
                lang: 'eng'
            })
        }
}