const passport = require('passport');
const User = require('../models/users');
const config = require('../util/config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const jwtOptions = {
  jwtFromRequest: ({headers, query}) => {
    if (headers.authorization) return headers.authorization;
    else if (query.token) return query.token;
    else return null;
  },
  secretOrKey: config.secretKey
};

const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
  User.findById(payload.sub, function(err, user) {
    if (err) { return done(err, false); }

    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  });
});

passport.use(jwtLogin);