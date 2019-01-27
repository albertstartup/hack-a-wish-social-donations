//const app = require('express')();
import {Request, Response} from "express";
import express from 'express'
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
import {Socket} from 'socket.io';
import path from 'path';
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const prod_mongo_url = process.env.MONGODB_URI;

const mongo_url = prod_mongo_url || 'mongodb://localhost:27017';
console.log('mongo url: ', mongo_url);

const dbName = 'wish1';

// @ts-ignore
const insertDocuments = function(db, callback) {
    // Get the documents collection
    const collection = db.collection('documents');
    // Insert some documents

    // @ts-ignore
    const cb = function(err, result) {
        assert.equal(err, null);
        assert.equal(3, result.result.n);
        assert.equal(3, result.ops.length);
        console.log("Inserted 3 documents into the collection");
        callback(result);
    };

    collection.insertMany([
        {a : 1}, {a : 2}, {a : 3}
    ], cb);
};

// @ts-ignore
MongoClient.connect(mongo_url, function(err, client) {
    if (err) {
        console.error('error while connecting to mongo_url: ', err);
    }

    console.log("Connected successfully to mongo");

    const db = client.db('heroku_fm6l65k6');

    insertDocuments(db, function() {
        client.close();
    });
});

const port = process.env.PORT || 4242;

app.use(express.static(path.resolve(__dirname, '../react-ui/build')));

app.get("/", (req: Request, res: Response) => {
    res.send("got root working")
});

app.get('*', function(request: Request, response: Response) {
    response.sendFile(path.resolve(__dirname, '../react-ui/build', 'index.html'));
});

io.on('connection', (socket: Socket) => {
    console.log('a user connection');
});

let counter = 1;
setInterval(() => {
    const newDonation = {user: 'Ken', amount: counter*5, id: counter};
    counter++;
    io.emit('newDonation', newDonation);
    console.log('newDonation: ', newDonation);
}, 8000);

http.listen(port, () => console.log(`Listening on port: ${port}`));