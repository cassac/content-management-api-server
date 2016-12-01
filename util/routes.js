const UsersController = require('../controllers/users');
const AuthController = require('../controllers/auth');
const apiRouter = require('express').Router();
const authRouter = require('express').Router();

const passport = require('passport');
const passportService = require('../services/passport');

const { requireUserOrAdmin, requireAdmin } = require('./auth');
const requireAuth = passport.authenticate('jwt', { session: false });

apiRouter.get('/users', requireAuth, requireAdmin, UsersController.get);
apiRouter.post('/users', requireAuth, requireAdmin, UsersController.post);
apiRouter.delete('/users/:userId', requireAuth, requireAdmin, UsersController.delete);
apiRouter.get('/users/:userId', requireAuth, requireUserOrAdmin, UsersController.get);
apiRouter.put('/users/:userId', requireAuth, requireUserOrAdmin, UsersController.put);

authRouter.post('/signin', AuthController.signin);
authRouter.post('/signup', AuthController.signup);

module.exports = {
  apiRouter,
  authRouter
};