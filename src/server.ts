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
const cors = require('cors');

const prod_mongo_url = process.env.MONGODB_URI;

const mongo_url = prod_mongo_url || 'mongodb://localhost:27017';
console.log('mongo url: ', mongo_url);

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
const insertDonation = (db, name, amount, callback) => {
    const collection = db.collection('donations');

    collection.insert({name: name, amount: amount, date: new Date()},
        callback);
};

// @ts-ignore
let db;

// @ts-ignore
MongoClient.connect(mongo_url, function(err, client) {
    if (err) {
        console.error('error while connecting to mongo_url: ', err);
    }

    console.log("Connected successfully to mongo");

    db = client.db('heroku_fm6l65k6');
});

const port = process.env.PORT || 4242;

app.use(cors());
app.use(express.json());

app.use(express.static(path.resolve(__dirname, '../react-ui/build')));

app.get("/", (req: Request, res: Response) => {
    res.send("got root working")
});

app.post("/addDonation", (req: Request, res: Response) => {
    if (req.body && req.body.name && req.body.amount) {
        // @ts-ignore
        insertDonation(db, req.body.name, req.body.amount, (err, doc) => {
            console.log('doc:', doc);
            const donation = doc.ops[0];
            io.emit('newDonation', {user: donation.name, amount: donation.amount, id: donation._id});
            res.send(`added donation: ${req.body.name}:${req.body.amount}`);
        })
    } else {
        res.send({error: 'adddonation missing fields'})
    }
});

app.get('*', function(request: Request, response: Response) {
    response.sendFile(path.resolve(__dirname, '../react-ui/build', 'index.html'));
});

io.on('connection', (socket: Socket) => {
    console.log('a user connection');
});

// let counter = 1;
// setInterval(() => {
//     const newDonation = {user: 'Ken', amount: counter*5, id: counter};
//     counter++;
//     io.emit('newDonation', newDonation);
//     console.log('newDonation: ', newDonation);
// }, 8000);

http.listen(port, () => console.log(`Listening on port: ${port}`));