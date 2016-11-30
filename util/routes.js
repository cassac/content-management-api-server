const UsersController = require('../controllers/users');
const AuthController = require('../controllers/auth');
const apiRouter = require('express').Router();
const authRouter = require('express').Router();

const passport = require('passport');
const passportService = require('../services/passport');

const requireAuth = passport.authenticate('jwt', { session: false });

// TODO
// add requireAdmin middleware

apiRouter.get('/users', requireAuth, UsersController.get);
apiRouter.post('/users', UsersController.post);
apiRouter.delete('/users/:userId', UsersController.delete);
apiRouter.get('/users/:userId', UsersController.get);
apiRouter.put('/users/:userId', UsersController.put);

authRouter.post('/signin', AuthController.signin);
authRouter.post('/signup', AuthController.signup);

module.exports = {
  apiRouter,
  authRouter
};