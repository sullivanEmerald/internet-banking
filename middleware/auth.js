 
 const account =  require('../models/accounts')

module.exports = {
    ensureAuth: function (req, res, next) {
      if (req.isAuthenticated()) {
        return next();
      } else {
        res.redirect("/");
      }
    },

    ensureAdmin: function (req, res, next) {
      if (req.isAuthenticated() && req.user.admin) {
        return next();
      } else {
        res.redirect("/search");
      }
    },

    

  };