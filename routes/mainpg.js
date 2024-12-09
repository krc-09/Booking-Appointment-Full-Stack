const express = require('express');



const mainpageController = require('../controllers/mainpg');


const router = express.Router();


router.get('/home',mainpageController.gethomePage);

module.exports = router;