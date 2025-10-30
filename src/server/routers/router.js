const express = require('express')
const controller = require('../controllers/controller')

const router = express.Router();
const { getAllGames, addGame, getAllUsers, addUser, getAllLocations, addLocation, getAllGamesUsers } = controller;

router.get('/games', getAllGames)
router.post('/games', addGame)

router.get('/users', getAllUsers)
router.post('/users', addUser)

router.get('/locations', getAllLocations)
router.post('/locations', addLocation)

router.get('/games-users', getAllGamesUsers)

module.exports = router;