const UsersController = require('../controllers/users');
const FilesController = require('../controllers/files');
const AuthController = require('../controllers/auth');
const apiRouter = require('express').Router();
const authRouter = require('express').Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json({ type: '*/*' });
const passport = require('passport');
const passportService = require('../services/passport');

const { requireUserOrAdmin, requireAdmin } = require('./auth');
const requireAuth = passport.authenticate('jwt', { session: false });

const adminOnly = [requireAuth, requireAdmin, jsonParser];
const userOrAdmin = [requireAuth, requireUserOrAdmin, jsonParser];

apiRouter.get('/users', adminOnly, UsersController.get);
apiRouter.post('/users', adminOnly, UsersController.post);
apiRouter.delete('/users/:userId', adminOnly, UsersController.delete);
apiRouter.get('/users/:userId', userOrAdmin, UsersController.get);
apiRouter.put('/users/:userId', userOrAdmin, UsersController.put);

apiRouter.get('/users/:userId/files', userOrAdmin, FilesController.userFiles.get);
// POSTing files need to use multiparty middleware instead of bodyParser
apiRouter.post('/users/:userId/files', requireAuth, requireUserOrAdmin, FilesController.userFiles.post);

apiRouter.get('/files/:fileId', userOrAdmin, FilesController.singleFile.get);
apiRouter.put('/files/:fileId', userOrAdmin, FilesController.singleFile.put);
apiRouter.delete('/files/:fileId', userOrAdmin, FilesController.singleFile.delete);
apiRouter.get('/files', adminOnly, FilesController.allFiles.get);

authRouter.post('/signin', AuthController.signin);
authRouter.post('/signup', AuthController.signup);

module.exports = {
  apiRouter,
  authRouter
};