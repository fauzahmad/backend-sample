let express = require('express');
let router = express.Router();
let {body} = require('express-validator');
let userController = require('../controllers/user');
let {authenticateToken} = require('../controllers/user')

router.post('/signup', body(['data.username', 'data.email', 'data.password']).isLength({min: 1}), userController.signup)
router.post('/login', body(['email', 'password']).isLength({min: 1}), authenticateToken, userController.login)

module.exports = router;