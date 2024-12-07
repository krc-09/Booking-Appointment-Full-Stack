const express = require('express');
const groupUserController = require('../controllers/groupUserController');
const authentication = require('../middleware/auth');
const router = express.Router();



router.post('/add-users',authentication.authenticate,groupUserController.addUserToGroup);
router.get('/getgroupuserdetails',authentication.authenticate,groupUserController.getUserGroups);
router.get('/get-users-by-id',authentication.authenticate,groupUserController.getGroupUsers);
router.post('/remove-user',authentication.authenticate,groupUserController.removeUserToGroup);





module.exports = router;
