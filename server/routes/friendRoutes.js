const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const {
    getAllFriends,
    sendFriendRequest,
    acceptFriendRequest,
    removeFriend,
    searchUsers,
    addFriendManually
} = require('../controllers/friendController');

router.use(protect);

router.get('/', getAllFriends);
router.post('/', sendFriendRequest);
router.post('/manual', addFriendManually);
router.put('/:id/accept', acceptFriendRequest);
router.delete('/:id', removeFriend);
router.get('/search', searchUsers);

module.exports = router;
