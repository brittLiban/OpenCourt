export async function getLocations() {
  const res = await fetch(`/locations`);
  if (!res.ok) throw new Error("Failed to fetch events");
  return res.json();
}

export async function createLocation(locationData) {
  const res = await fetch(`/locations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(locationData),
  });

  if (!res.ok) throw new Error("Failed to create location.");
  return res.json();
}