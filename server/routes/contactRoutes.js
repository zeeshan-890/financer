const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const auth = require('../middlewares/authMiddleware');

router.get('/', auth, contactController.getAllContacts);
router.post('/', auth, contactController.addContact);
router.get('/:id', auth, contactController.getContact);
router.put('/:id', auth, contactController.updateContact);
router.delete('/:id', auth, contactController.deleteContact);

module.exports = router;
