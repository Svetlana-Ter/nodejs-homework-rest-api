const express = require('express');
const router = express.Router();
const { registration, login, logout, getCurrentUser, updateAvatar } = require('../../controllers/users');
const guard = require('../../helpers/guard');
const { validationLoginUser, validationRegistrationUser } = require('./validation');
const uploadAvatar = require('../../helpers/upload-avatar');

router.post('/signup', validationRegistrationUser, registration);
router.post('/login', validationLoginUser, login);
router.post('/logout', logout);
router.get('/current', guard, getCurrentUser);
router.patch('/avatars', guard, uploadAvatar.single('avatar'), updateAvatar);

module.exports = router;
