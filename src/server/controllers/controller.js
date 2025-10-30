const db = require('../model/db')

const getAllGames = async (req, res) => {
    try {
        const [data] = await db.query('SELECT * FROM games');
        res.status(200).json(data);
    } catch (err) {
        console.error('DB error in getAllGames:', err);
        res.status(500).json({ error: 'Internal server error' })
    }
}

const addGame = async (req, res) => {
    try {
        const { game_name, location_id } = req.body;
        if (game_name === "" || location_id < 1) {
            res.status(400).json({ error: 'Invalid input'})
        } else {
            const [result] = await db.query('INSERT INTO games (game_name, location_id) VALUES (?, ?)', [game_name, location_id]);
            res.status(201).json({ id: result.insertId })
        }
    } catch (err) {
        console.error('DB error in addGame:', err);
        res.status(500).json({ error: 'Internal server error' })
    }
}

const getAllUsers = async (req, res) => {
    try {
        const [data] = await db.query('SELECT * FROM users');
        res.status(200).json(data);
    } catch (err) {
        console.error('DB error in getAllUsers:', err);
        res.status(500).json({ error: 'Internal server error' })
    }
}

const addUser = async (req, res) => {
    try {
        const { user_name } = req.body;
        if (user_name === "") {
            res.status(400).json({ error: 'Invalid input'})
        } else {
            const [result] = await db.query('INSERT INTO users (user_name) VALUES (?)', [user_name]);
            res.status(201).json({ id: result.insertId })
        }  
    } catch (err) {
        console.error('DB error in addUser:', err);
        res.status(500).json({ error: 'Internal server error' })
    }
}

const getAllLocations = async (req, res) => {
    try {
        const [data] = await db.query('SELECT * FROM locations');
        res.status(200).json(data);;
    } catch (err) {
        console.error('DB error in getAllLocations:', err);
        res.status(500).json({ error: 'Internal server error' })
    }
}

const addLocation = async (req, res) => {
    try {
        const { location_name, address } = req.body;
        if (location_name === "" || address === "") {
            res.status(400).json({ error: 'Invalid input'})
        } else {
            const [result] = await db.query('INSERT INTO locations (location_name, address) VALUES (?, ?)', [location_name, address]);
            res.status(201).json({ id: result.insertId })
        }
    } catch (err) {
        console.error('DB error in addLocation:', err);
        res.status(500).json({ error: 'Internal server error' })
    }
}

const getAllGamesUsers = async (req, res) => {
    try {
        const [data] = await db.query('SELECT * FROM games_users');
        res.status(200).json(data);
    } catch (err) {
        console.error('DB error in getAllGamesUsers:', err);
        res.status(500).json({ error: 'Internal server error' })
    }
}

module.exports = {getAllGames, addGame, getAllUsers, addUser, getAllLocations, addLocation, getAllGamesUsers };