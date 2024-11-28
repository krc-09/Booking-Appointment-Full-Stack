const express = require('express');
const usersController = require('../controllers/users');
const authenticator =  require('../middleware/auth');
const router = express.Router();



router.post('/add-users', usersController.postSignupDetails);
router.post('/login',usersController.postLoginDetails);
router.get('/loggedin',usersController.getLoggedinDetails);





module.exports = router;
