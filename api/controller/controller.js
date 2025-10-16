import * as dataLayer from '../db/courtsRepo.js'

export const getAllGames = async (req, res) => {
    try {
        const data = await dataLayer.getAllGames();
        res.status(200).json({ message: "success", data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getGamesBySport = async (req, res) => {
    const { sport } = req.params;
    try {
        const games = await dataLayer.getGamesBySport(sport);
        res.render('games-by-sport', { sport, games });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
};

export const getGameById = async (req, res) => {
  const { id } = req.params;

  try {
    const game = await dataLayer.getGameById(id); 

    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    res.status(200).json({
      message: "success",
      data: game
    });
  } catch (error) {
    console.error('Error fetching game:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

 export const createGame = async (req, res) => {
  try {

    console.log('BACKEND: Data received in controller (req.body):', req.body);
    const game = await dataLayer.addGame(req.body);
    res.status(201).json(game);
  } catch (error) {
    console.error("Error creating game:", error);
    res.status(500).json({ error: "Failed to create new game" });
  }
};

export const updateGame = async (req, res) => {
 
    const gameId = req.params.id; 
    

    const { date, time, numberOfPeople } = req.body; 


    const updatedGame = { gameId };
    let fieldsProvided = false;

    if (date !== undefined) {
        updatedGame.date = date;
        fieldsProvided = true;
    }
    if (time !== undefined) {
        updatedGame.time = time;
        fieldsProvided = true;
    }

    if (numberOfPeople !== undefined) { 
        updatedGame.numberOfPeople = numberOfPeople ? parseInt(numberOfPeople, 10) : null;
        fieldsProvided = true;
    }


    if (!fieldsProvided) {
        return res.status(400).json({
            message: "failure - No valid update fields provided (date, time, or numberOfPeople).",
            data: null
        });
    }

    try {

        const [affectedRows] = await dataLayer.updateGame(gameToUpdate);

        if (affectedRows) {

            res.status(200).json({
                message: "success",
                data: { gameId: gameId, changes: gameToUpdate }
            }); 
        } else {

            res.status(500).json({
                message: "failure - unexpected update count",
                data: null
            });
        }
    } catch (error) {
        console.error("Error updating game:", error);
        res.status(500).json({
            message: "failure - internal server error during update",
            data: null
        });
    }
};

export const deleteGame = async (req, res) => {
    const { gameId } = req.params;
    const result = await dataLayer.deleteRecipe(gameId);

    if (result) {
        res.status(200).json({
            message: "success",
            data: result
        })
    } else {
        res.status(404).json({
            message: "failure - recipe not found",
            data: null
        })
    }
}
