const express = require('express');
const groupsmessageController = require('../controllers/groupmessages');
const authentication = require('../middleware/auth');
const router = express.Router();






router.post('/post-message',authentication.authenticate,groupsmessageController.postGroupMessageDetails);

 router.get('/get-group-messages/:groupId',authentication.authenticate,groupsmessageController.getGroupMessageDetails);

 module.exports = router;
