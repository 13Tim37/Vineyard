const Player = require('../models/player.js');

createPlayer = (name, guid, kills = 0, deaths = 0) => {

    const player = {
        name: name,
        guid: guid,
        kills: kills,
        deaths: deaths,
    }

    Player.create(player, (err, player) => {
        if (err) return false;
        return {
            name: player.name,
            guid: player.guid,
            kills: player.kills,
            deaths: player.deaths
        };
    })
}

createPlayerRequest = (req, res) => {

    const player = {
        name: req.body.name,
        guid: req.body.guid,
        kills: req.body.kills || 0,
        deaths: req.body.deaths || 0,
    }

    Player.create(player, (err, player) => {
        if (err) return res.status(500).send("There was a problem adding the player to the database.");
        res.status(200).send({
            name: player.name,
            guid: player.guid,
            kills: player.kills,
            deaths: player.deaths
        });
    })
}

// getPlayerByGUID = guid => {
//     Player.findOne({ guid: guid }, (err, player) => {
//         if (err) return false;
//         return player
//     })
// }

getPlayerByGUID = (req, res) => {
    Player.findOne({ guid: req.params.guid }, (err, player) => {
        if (err) return res.status(404).json({
          message: "No player exists with this GUID."
        });

        res.status(200).json(player);
    })
}

listPlayers = (req, res) => {
    Player.find({}, (err, players) => {
        if (err) return res.status(500).json({
          message: "No player exists with this ID."
        });

        res.status(200).send(players.map(player => ({
            name: player.name,
            guid: player.guid,
            kills: player.kills,
            deaths: player.deaths
        })));
    })
}

updatePlayersKills = (guid, kills) => {
    Player.findOneAndUpdate({ guid: guid }, {kills: kills}, {useFindAndModify: false}, (err, player) => {
        if (err) return false;
        return player
    })
}

module.exports = {
    createPlayer,
    getPlayerByGUID,
    listPlayers,
    updatePlayersKills
}