const UsersController = require('../controllers/users');
const FilesController = require('../controllers/files');
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

apiRouter.get('/users/:userId/files', requireAuth, requireUserOrAdmin, FilesController.userFiles.get);
apiRouter.post('/users/:userId/files', requireAuth, requireUserOrAdmin, FilesController.userFiles.post);

apiRouter.get('/files/:fileId', requireAuth, requireUserOrAdmin, FilesController.singleFile.get);
apiRouter.put('/files/:fileId', requireAuth, requireUserOrAdmin, FilesController.singleFile.put);
apiRouter.delete('/files/:fileId', requireAuth, requireUserOrAdmin, FilesController.singleFile.delete);
apiRouter.get('/files', requireAuth, requireAdmin, FilesController.allFiles.get);

authRouter.post('/signin', AuthController.signin);
authRouter.post('/signup', AuthController.signup);

module.exports = {
  apiRouter,
  authRouter
};