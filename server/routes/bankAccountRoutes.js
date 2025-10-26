const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const {
    getAllAccounts,
    createAccount,
    updateAccount,
    deleteAccount,
    setDefaultAccount
} = require('../controllers/bankAccountController');

router.use(protect);

router.route('/')
    .get(getAllAccounts)
    .post(createAccount);

router.route('/:id')
    .put(updateAccount)
    .delete(deleteAccount);

router.put('/:id/default', setDefaultAccount);

module.exports = router;
