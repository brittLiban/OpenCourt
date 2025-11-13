import { useState, useEffect } from "react";
import Games from '../components/Games'
import GamesForm from '../components/GamesForm';
import { getGames } from '../api/Games';

function EventsPage() {
    const[games, setGames] = useState([]);


    useEffect(() => {
        getGames()
        .then(setGames)
        .catch((err) => console.error("Error fetching games:", err));
    }, []);

    const addGame = (newGame) => {
        setGames(prevGames => [...prevGames, newGame]);
    };

    return( 
    <>
        <Games games={games} />
        <GamesForm onAddGame={addGame} />
    </>
    );
}

export default EventsPage;