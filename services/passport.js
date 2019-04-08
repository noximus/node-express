// require("../models/User");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const mongoose = require("mongoose");
const keys = require("../config/keys");
// require("../models/User");

const User = mongoose.model("users");
// Places cookie
passport.serializeUser((user, done) => {
  done(null, user.id);
  console.log("put cookie");
});
// retrieves cookie
passport.deserializeUser((id, done) => {
  console.log("retrieve cookie");
  User.findById(id).then(user => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: "/auth/google/callback",
      proxy: true
    },
    // async (accessToken, refreshToken, profile, done) => {

    //   User.findOne({ googleId: profile.id }).then(existingUser => {
    //     if (existingUser) {
    //       return done(null, existingUser);
    //     }
    //       const user = await new User({ googleId: profile.id }).save();
    //       done(null, user);
    //   });
    // },
    async (accessToken, refreshToken, profile, done) => {
      console.log("hello " + profile.id + " got a request back");
      const existingUser = await User.findOne({ googleId: profile.id });

      if (existingUser) {
        return done(null, existingUser);
      }

      const user = await new User({ googleId: profile.id }).save();
      done(null, user);
    }
  )
);
