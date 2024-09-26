const express = require('express');
const { playGame, winGame } = require('../controllers/gameController');
const { signup, login, getUserFunds, depositMoney, getUserXP, lottoFund } = require('../controllers/authControllers'); 
const protect = require('../middleware/authMiddleware'); 
const router = express.Router();

router.post('/signup', signup);

router.post('/login', login);

router.get('/user/funds', protect, getUserFunds);

router.post('/user/deposit', protect, depositMoney);

router.post('/user/play-game', protect, playGame);

router.post('/user/win', protect, winGame);

router.get('/user/xp', protect, getUserXP);

router.get('/user/lottoFund', protect, lottoFund);

module.exports = router;
