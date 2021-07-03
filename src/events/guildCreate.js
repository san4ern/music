module.exports = async(client, guild) => {
    const monguild = await mongo.guilds.findOne({
        guildID: guild.id
    })
    client.cache.set(guild.id, {
        prefix: monguild.prefix,
        lang: monguild.lang
    })   
        if(!monguild) {
            mongo.guilds.insertOne({
                guildID: guild.id,
                prefix: 'm/',
                lang: 'eng'
            })
            client.cache.set(guild.id, {
                prefix: 'm/',
                lang: 'eng'
            })
        }
}