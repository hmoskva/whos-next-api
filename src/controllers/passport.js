const passport = require('passport');
const LocalStrategy = require('passport-local');
const config = require('config');
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const User = require('../models/user');
const StatusError = require('../helpers/errors');

passport.use(
  'signup',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    },
    async (req, email, password, done) => {
      try {
        const {phone, role} = req.body;
        let user = await User.findOne({email});
        if (user) {
          return done(StatusError('User already exist'), false);
        }
        const body = {
          email,
          password,
          phone
        };
        if (role) {
          body.role = role;
        }
        user = new User(body);
        await user.save();
        return done(null, user, {msg: 'Sign up Successful'});
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.use(
  'login',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({email});
        if (!user) {
          return done(StatusError('User not found'), false);
        }
        const validate = await user.isValidPassword(password);
        if (!validate) {
          return done(StatusError('Wrong password'), false);
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.use(
  new JWTstrategy(
    {
      secretOrKey: config.get('secret'),
      ignoreExpiration: true,
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
    },
    async (token, done) => {
      try {
        return done(null, token.user);
      } catch (error) {
        return done(error);
      }
    }
  )
);
