"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function GameDetailPage() {
  const params = useParams();
  const gameId = params.id; // e.g., '123'
  
  const [game, setGame] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!gameId) return;

    const fetchGameDetails = async () => {
      setIsLoading(true);
      try {
        
        const res = await fetch(`http://localhost:3001/games/${gameId}`); 

        if (!res.ok) {
          throw new Error(`Failed to fetch game ${gameId}`);
        }

        const json = await res.json();

        setGame(json.game || json); 

      } catch (err) {
        console.error("Failed to fetch game details", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGameDetails();
  }, [gameId]);

  if (isLoading) {
    return <h1>Loading Game Details...</h1>;
  }

  if (!game) {
    return <h1>Game Not Found</h1>;
  }

  return (
    <div>
      <h1>Game: {game.title || 'Details'}</h1>
      <p>Sport: {game.sport}</p>
      <p>Location: {game.courtName}</p>

    </div>
  );
}