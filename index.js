const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const { fileCrawler } = require('./lib/file-crawler.js');

let onlinePlayers = [];

const logOnlinePlayers = async () => setInterval(() => console.log('onlinePlayers', onlinePlayers), 10000);
logOnlinePlayers();

const processLine = async line => {
    if (line.includes('<img=ico_swordone>') || line.includes('<img=ico_spear>') || line.includes('<img=ico_')) {
        // If a kill takes place
        console.log('PLAYER KILLED');

        const lineArray = line.split(' ');

        const player1 = line.slice(11, line.indexOf('<') - 1);
        const player2 = lineArray[lineArray.length - 1];

        console.log('player1', player1, 'has killed', 'player2', player2);

        try {
            // const guid1 = onlinePlayers.find(player => player.name === player1).guid;
            onlinePlayers.find(player => player.name === player1).kills++
            // TODO: Update database
        } catch(e) {
            console.log('Player 1 not online!', e);
        }

        try {
            const guid2 = onlinePlayers.find(player => player.name === player2).guid;
            // TODO: Update database
        } catch(e) {
            console.log('Player 2 not online!', e);
        }

    } else if (line.includes('has joined the game with ID:')) {
        // Player join
        console.log('PLAYER JOIN');

        const lineArray = line.split(' ');

        const player = line.slice(11, line.indexOf(' has '));
        const guid = lineArray[lineArray.length - 1];

        onlinePlayers.push({
            name: player,
            guid: guid,
            kills: 0,
            deaths: 0
        });

    } else if (line.includes('has left the game with ID:')) {
        // Player left
        console.log('PLAYER LEFT');

        const lineArray = line.split(' ');

        const guid = lineArray[lineArray.length - 1];

        onlinePlayers.splice(onlinePlayers.findIndex(player => player.guid = guid), 1);

    } else if (line.includes(' Changed the map to ')) {
        // Map change
        console.log('MAP CHANGE');

        onlinePlayers = [];

    } else if (line.includes('SERVER has joined the game with ID: 0')) {
        // Server start
        console.log('SERVER START');

        onlinePlayers = [];
    }
}

fileCrawler(processLine);

// mongoose.connect(process.env.MONGODB_URL);

// const app = express();

// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

// require('./api/routes')(app);

// const port = process.env.PORT || 3000;

// app.listen(port, () => console.log('Vineyard RESTful API server started on: ' + port));
