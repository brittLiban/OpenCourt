export async function getUsers() {
  const res = await fetch(`/api/users`);
  if (!res.ok) throw new Error("Failed to fetch events");
  return res.json();
}

export async function createUser(userData) {
  const res = await fetch(`/api/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

  if (!res.ok) throw new Error("Failed to create user.");
  return res.json();
}