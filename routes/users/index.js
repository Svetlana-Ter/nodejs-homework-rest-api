const express = require('express');
const router = express.Router();
const { registration, login, logout, getCurrentUser } = require('../../controllers/users');
const guard = require('../../helpers/guard');
const { validationLoginUser, validationRegistrationUser } = require('./validation');

router.post('/signup', validationRegistrationUser, registration);
router.post('/login', validationLoginUser, login);
router.post('/logout', logout);
router.get('/current', guard, getCurrentUser);

module.exports = router;
