const { MongoClient } = require('mongodb');

async function connect(app) {
    try {
        const mongoClient = new MongoClient(process.env.MONGO_URI, { useUnifiedTopology: true});
        const connectedClient = await mongoClient.connect();
        app.locals.db = connectedClient.db(process.env.DB_NAME);
        
        await createCollections(app);
        
        console.log('Connected...');

    } catch (err) {
        console.log(err.stack);
    }
}

async function createCollections(app) {
    try {
        const collections = await app.locals.db.listCollections({ name: 'url' });
        
        if (collections.length === 0) {
            return;
        }

        return await app.locals.db.createCollection('url');

    } catch (err) {
        console.log(err.stack);
    }
}

module.exports = {
    connect
};