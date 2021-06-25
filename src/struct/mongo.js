module.exports = async () => {
    const MongoClient = require('mongodb').MongoClient;
    new Promise(async (res, rej) => {
      await MongoClient.connect(process.env.MONGO, {useNewUrlParser: true, useUnifiedTopology: true}, async (err, dbClient) => {
            if(err) {
                return console.log(`[DATA_BASE] Error! Failed connect to MongoDB!\n${err.name}\n${err.message}`)
            }
            const db = dbClient.db('bot');
            global.mongo = {
                client: dbClient,
                db: db,
                guilds: db.collection('guilds')
            }
            console.log("[MONGODB | ✅] Успешно подключён к базе данных");
            res();
        })
        
    })
    
}