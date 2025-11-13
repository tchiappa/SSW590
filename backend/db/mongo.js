const { MongoClient } = require('mongodb');

class MongoConnection {
    constructor() {
        this.client = null;
        this.mongoUri = process.env.MONGO_URI || 'mongodb://mongo:27017/mydb';
        this.dbName = 'mydb'; // You could make this configurable too
    }

    async connect() {
        try {
            this.client = new MongoClient(this.mongoUri);
            await this.client.connect();
            console.log('Successfully connected to MongoDB.');
            
            this.client.on('error', (err) => {
                console.error('MongoDB connection error:', err);
            });

            return this;
        } catch (err) {
            console.error('Failed to connect to MongoDB:', err);
            throw err;
        }
    }

    async close() {
        if (this.client) {
            await this.client.close();
            this.client = null;
            console.log('MongoDB connection closed.');
        }
    }

    // Database operation methods
    collection(name) {
        if (!this.client) {
            throw new Error('MongoDB client not initialized. Call connect() first.');
        }
        return this.client.db(this.dbName).collection(name);
    }

    // Common database operations
    async findOne(collectionName, query = {}) {
        return await this.collection(collectionName).findOne(query);
    }

    async find(collectionName, query = {}) {
        return await this.collection(collectionName).find(query).toArray();
    }

    async insertOne(collectionName, document) {
        return await this.collection(collectionName).insertOne(document);
    }

    async insertMany(collectionName, documents) {
        return await this.collection(collectionName).insertMany(documents);
    }

    async updateOne(collectionName, filter, update) {
        return await this.collection(collectionName).updateOne(filter, { $set: update });
    }

    async updateMany(collectionName, filter, update) {
        return await this.collection(collectionName).updateMany(filter, { $set: update });
    }

    async deleteOne(collectionName, filter) {
        return await this.collection(collectionName).deleteOne(filter);
    }

    async deleteMany(collectionName, filter) {
        return await this.collection(collectionName).deleteMany(filter);
    }

    async aggregate(collectionName, pipeline) {
        return await this.collection(collectionName).aggregate(pipeline).toArray();
    }
}

// Create a singleton instance
const mongoConnection = new MongoConnection();

// Handle process termination
process.on('SIGINT', async () => {
    await mongoConnection.close();
    process.exit(0);
});

module.exports = mongoConnection;