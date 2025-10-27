export async function getGames() {
  const res = await fetch(`/games`);
  if (!res.ok) throw new Error("Failed to fetch games");
  return res.json();
}

export async function createGame(gameData) {
  const res = await fetch(`/games`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(gameData),
  });

  if (!res.ok) throw new Error("Failed to create game.");
  return res.json();
}