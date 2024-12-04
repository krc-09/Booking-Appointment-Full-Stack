const express = require('express');
const groupsController = require('../controllers/groups');
const authentication = require('../middleware/auth');
const router = express.Router();



router.post('/create',authentication.authenticate,groupsController.postGroupDetails);
 router.get('/create',authentication.authenticate,groupsController.getgroupDetails);





module.exports = router;
