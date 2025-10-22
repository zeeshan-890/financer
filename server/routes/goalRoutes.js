const express = require('express');
const router = express.Router();
const goalController = require('../controllers/goalController');
const auth = require('../middlewares/authMiddleware');

router.post('/', auth, goalController.createGoal);
router.get('/', auth, goalController.getAllGoals);
router.get('/:userId', auth, goalController.getGoals);
router.patch('/:id', auth, goalController.updateGoal);
router.patch('/:id/add-funds', auth, goalController.addFunds);
router.delete('/:id', auth, goalController.deleteGoal);

module.exports = router;
