const express = require('express');
const router = express.Router();

const userController = require('../controllers/user');

router.get('/getAllUsers', userController.getAllUsers);
router.post('/createUser', userController.createUser);
router.get('/getOne/:id', userController.getOneUser);
router.post('/giveRewards/:id', userController.giveReward);
router.post('/deleteRewards/:id', userController.deleteReward)

module.exports = router;