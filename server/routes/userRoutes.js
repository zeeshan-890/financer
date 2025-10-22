const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middlewares/authMiddleware');

router.get('/search', auth, userController.searchUsers);
router.get('/friends', auth, userController.getFriends);
router.get('/:id', auth, userController.getUser);
router.put('/profile', auth, userController.updateUser);
router.post('/friends', auth, userController.addFriend);
router.delete('/friends/:friendId', auth, userController.removeFriend);

module.exports = router;
