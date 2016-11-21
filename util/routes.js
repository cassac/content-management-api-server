const UsersController = require('../controllers/users');
const router = require('express').Router();

router.get('/users', UsersController.get);
router.post('/users', UsersController.post);
router.delete('/users/:userId', UsersController.delete);
router.get('/users/:userId', UsersController.get);
router.put('/users/:userId', UsersController.put);

module.exports = router;