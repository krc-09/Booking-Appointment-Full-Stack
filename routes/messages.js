const express = require('express');
const messagesController = require('../controllers/messages');
const authentication = require('../middleware/auth');
const router = express.Router();



router.post('/add-messages',authentication.authenticate, messagesController.postMessageDetails);
router.get('/get-messages',authentication.authenticate,messagesController.getmessages);




module.exports = router;