import express from 'express';
import cors from 'cors';
import  { initDB } from './db/db.js';      
import sequelize from './db/db.js';      
import routes from './routes/router.js';
import authRouter from './routes/auth.js';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import connectSession from "connect-session-sequelize";
import passport from '../api/services/passport.js';      


import 'dotenv/config'; 
const app = express();
const PORT = process.env.PORT

//allow other urls to access this
app.use(cors({
  origin: true,        
  credentials: true,   
}));
app.use(express.json());
app.use(cookieParser())



//sessions
// create Sequelize-backed store for express-session
const SequelizeStore = connectSession(session.Store); 
// uses existing sequelize instance
const store = new SequelizeStore({db : sequelize})
// create sessions table if missing
await store.sync();


app.use(
  session({
    secret: "b3f9a6d2e7c1f48a9d2b4c7f3e1a5c6d8f2b9a0c7e4d1f3b6a8c9e0d1f2b3a4",   // need to change lol,  used to sign the session ID cookie (prevents tampering)
    resave: false,                     // don't re-save session if nothing changed
    saveUninitialized: false,          // don't create empty sessions before login
    store,                             // where sessions are actually stored (DB)
    cookie: {
      sameSite: "lax",                 // prevents most cross-site issues
      secure: false,                   // cookie can be sent over HTTP (not just HTTPS)
      maxAge: 1000 * 60 * 60 * 24,     // session expires after 1 day
    },
  })
);


// middleware verifying user is logged in on each route
app.use(passport.initialize());
app.use(passport.session());

// Initialize database
try {
  await initDB();
} catch (err) {
  console.error('Failed to initialize database:', err);
  process.exit(1);
}

//make sure their authenticated! 
app.use('/api', authRouter);
//server mounting - all game/auth routes
app.use('/api', routes);

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
}); 