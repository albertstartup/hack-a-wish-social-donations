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

const url = 'mongodb://localhost:27017';

const dbName = 'wish1';


// @ts-ignore
MongoClient.connect(url, function(err, client) {
    assert.equal(null, err);
    console.log("Connected successfully to mongo");

    const db = client.db(dbName);

    client.close();
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