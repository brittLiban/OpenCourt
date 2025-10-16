import User from '../model/users.js'
import bcrypt from "bcryptjs"



export async function createUser(email, username, password) {
  try {
    const hashed = await bcrypt.hash(password, 10);
    const newUser = await User.create({ email, username, password : hashed });
    console.log("New user created:", newUser.toJSON());
    return newUser;
  } catch (err) {
    console.error("Error creating user:", err);
    throw err;
  }
}
