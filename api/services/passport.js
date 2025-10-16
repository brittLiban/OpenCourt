import passport from 'passport'
import { Strategy as LocalStrategy} from 'passport-local'
import bcrypt from 'bcryptjs'
import User from '../model/users.js'

//Login with Email + password
passport.use(new LocalStrategy(
  { usernameField: 'email', passwordField: 'password' },

  async (email, password, done) => {
    try {
      // find user by email
      const user = await User.findOne({ where: { email } });
      if (!user) return done(null, false, { message: "User not found" });

      // check hashed password
      const match = await bcrypt.compare(password, user.password);
      if (!match) return done(null, false, { message: "Incorrect password" });

      // success
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));


//store user id in session persistantly 
passport.serializeUser((user, done) => done(null, user.user_id));

//returns the full user object!
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

export default passport;