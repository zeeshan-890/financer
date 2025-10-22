const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');
const auth = require('../middlewares/authMiddleware');

router.post('/', auth, groupController.createGroup);
router.get('/', auth, groupController.getAllGroups);
router.get('/:id', auth, groupController.getGroupDetails);
router.post('/:id/members', auth, groupController.addMemberToGroup);
router.delete('/:id/members/:memberId', auth, groupController.removeMemberFromGroup);

module.exports = router;
