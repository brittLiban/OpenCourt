import { useState, useEffect } from "react";
import { Container, Typography, List, ListItem, ListItemText } from "@mui/material";
import { getGames } from "../api/Games.js";

function Games() {
  const [games, setGames] = useState([]);

  useEffect(() => {
    getGames()
      .then(setGames)
      .catch((err) => console.error("Error fetching events:", err));
  }, []);

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Typography variant="h4" gutterBottom align="center">
        Available Events
      </Typography>

      {games.length === 0 ? (
        <Typography variant="body1" align="center">
          No events yet. Create one!
        </Typography>
      ) : (
        <List>
          {games.map((game, index) => (
            <ListItem key={index} divider>
              <ListItemText primary={`${game.game_name} @ Location #${game.location_id}`} />
            </ListItem>
          ))}
        </List>
      )}

    </Container>
  );
}

export default Games;