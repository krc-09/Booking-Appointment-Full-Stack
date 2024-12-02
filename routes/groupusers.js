const express = require('express');
const groupUserController = require('../controllers/groupUserController');
const authentication = require('../middleware/auth');
const router = express.Router();



router.post('/add-users',authentication.authenticate,groupUserController.addUsersToGroup);
router.get('/getgroupuserdetails',authentication.authenticate,groupUserController.getUserGroups);





module.exports = router;
