const mongodb = require('mongodb');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../src/.env')});

const MongoClient = mongodb.MongoClient;
const dbURL = `mongodb+srv://${process.env.DB_USER_NAME}:${process.env.DB_PASSWORD}@cluster-movies-elfwa.mongodb.net/shop?retryWrites=true&w=majority`;


let _db;

const initDb = callback => {
  if (_db) {
    console.log('Database is already initialized!');
    return callback(null, _db);
  }
  MongoClient.connect((dbURL))
    .then(client => {
      _db = client;
      callback(null, _db);
    })
    .catch(err => {
      callback(err);
    })

}

const getDb = () => {
  if (!_db) {
    throw Error('Database not yet initialized!');
  }
  return _db;
}

module.exports = {
  initDb,
  getDb
}
