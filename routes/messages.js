const express = require('express');
const messagesController = require('../controllers/messages');
const authentication = require('../middleware/auth');
const router = express.Router();



router.post('/add-messages',authentication.authenticate, messagesController.postMessageDetails);




module.exports = router;

