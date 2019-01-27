const app = require('express')();
import {Request, Response} from "express";
//import express from 'express'
//const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
import {Socket} from 'socket.io'

app.get("/", (req: Request, res: Response) => {
    res.send("got root working")
});

io.on('connection', (socket: Socket) => {
    console.log('a user connection', socket);
});

let counter = 1;
setInterval(() => {
    const newDonation = {user: 'Ken', amount: counter*5, id: counter};
    counter++;
    io.emit('newDonation', newDonation);
    console.log('newDonation: ', newDonation);
}, 4000);

http.listen(80, () => console.log(`Listening on port: ${80}`));