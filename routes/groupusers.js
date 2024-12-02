const express = require('express');
const groupUserController = require('../controllers/groupUserController');
const authentication = require('../middleware/auth');
const router = express.Router();



router.post('/add-users',authentication.authenticate,groupUserController.addUsersToGroup);





module.exports = router;
