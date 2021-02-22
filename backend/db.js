const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const mongodbUrl = 'mongodb+srv://dbuser:TdpUurGYjP3dfTOv@sonic.tsoj2.mongodb.net/shop?retryWrites=true&w=majority';
const Decimal128 = mongodb.Decimal128;

let _db;

const initDb = callback => {
    if (_db) {
        return callback(null, _db)
    }
    MongoClient.connect(mongodbUrl)
        .then(client => {
            _db = client;
            callback(null, _db);

        })
        .catch(err => {
            callback(err)
        })
}

const getDb = () => {
    if (!_db) {
        throw Error('Database is not initialized');
    }
    return _db
}

module.exports = {
    initDb,
    getDb
}