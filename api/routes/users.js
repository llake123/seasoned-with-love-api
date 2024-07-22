const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const {authenticateLogin, postUserSignup, deleteUserById, getUserIds} = require('../controllers/usersController');

router.get('/userIds', checkAuth, getUserIds);

router.post('/login', authenticateLogin);

router.post('/signup', postUserSignup);

router.delete('/:userId',  checkAuth, deleteUserById);

module.exports = router;