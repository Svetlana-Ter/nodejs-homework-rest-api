const express = require('express');
const router = express.Router();
const {
  registration,
  login,
  logout,
  getCurrentUser,
  updateAvatar,
  verify,
  repeatEmailVerification,
} = require('../../controllers/users');
const guard = require('../../helpers/guard');
const { validationLoginUser, validationRegistrationUser, validationVerifyUser } = require('./validation');
const uploadAvatar = require('../../helpers/upload-avatar');

router.post('/signup', validationRegistrationUser, registration);
router.post('/login', validationLoginUser, login);
router.post('/logout', logout);
router.get('/current', guard, getCurrentUser);
router.patch('/avatars', guard, uploadAvatar.single('avatar'), updateAvatar);
router.get('/verify/:verificationToken', verify);
router.post('/verify', validationVerifyUser, repeatEmailVerification);

module.exports = router;
