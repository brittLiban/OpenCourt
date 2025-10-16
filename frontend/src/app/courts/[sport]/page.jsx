"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import GameList from "./../../components/GameList"; // adjust path as needed for nesting

export default function GamesBySportPage() {

  const params = useParams();
  const sport = params.sport;

  const [games, setGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {

    if (!sport) return;

    const fetchGamesBySport = async () => {
      setIsLoading(true);
      setError(null);
      try {

        const res = await fetch(`http://localhost:3001/courts/${sport}`);

        if (!res.ok) {
          throw new Error(`Failed to fetch games for ${sport}: ${res.statusText}`);
        }

        const json = await res.json();

        const fetchedGames = json.games || json;

        setGames(fetchedGames || []); 
      } catch (err) {
        console.error("Failed to fetch games by sport", err);
        setError("Could not load games. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchGamesBySport();
  }, [sport]); 

  if (error) {
    return (
      <div>
        <h1>Error</h1>
        <p style={{ color: 'red' }}>{error}</p>
      </div>
    );
  }

  return (
    <div>
      <h1>{sport.charAt(0).toUpperCase() + sport.slice(1)} Games</h1>

      {games.length === 0 ? (
        <p>No games found for {sport}.</p>
      ) : (
        <GameList games={games} />
      )}
    </div>
  );
}