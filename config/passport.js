const LocalStrategy = require("passport-local").Strategy;
const Accounts = require('../models/accounts');

module.exports = function (passport) {
  passport.use(new LocalStrategy({
    usernameField: 'account',
    passwordField: 'password'
  },
  function(account, password, done) {
    Accounts.findOne({ accountNumber: Number(account), password: Number(password) }, function(err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      return done(null, user);
    });
  }
));

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    Accounts.findById(id, (err, user) => done(err, user));
  });
};
