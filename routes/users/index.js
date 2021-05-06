const express = require('express');
const router = express.Router();
const Contacts = require('../../model/contacts');
const { registration, login, logout } = require('../../controllers/users');

router.post('/signup', registration);
router.post('/login', login);
router.post('/logout', logout);

module.exports = router;
