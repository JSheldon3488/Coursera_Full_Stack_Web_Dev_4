const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const url = 'mongodb://localhost:27017/';
const dbname = 'conFusion';

MongoClient.connect(url, (err, client) => {
    assert.strictEqual(err, null);
    console.log('Connect correctly to server');

    const db = client.db(dbname);
    
    const collection = db.collection('dishes');
    collection.insertOne({ "name": "Uthappizza", "description": "test"}, (err, result) => {
        assert.strictEqual(err, null);

        console.log("After Insert:");
        console.log(result.ops);

        collection.find({}).toArray((err, docs) => {
            assert.strictEqual(err, null);

            console.log("Found:");
            console.log(docs);

            db.dropCollection("dishes", (err, result) => {
                assert.strictEqual(err,null);
                client.close();
            });
        });
    });
});