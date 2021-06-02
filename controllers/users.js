require('dotenv').config();
const jimp = require('jimp');
const fs = require('fs/promises');
const path = require('path');
const jwt = require('jsonwebtoken');
const Users = require('../model/users');
const { HttpCode } = require('../helpers/constants');
const EmailService = require('../services/email');
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const registration = async (req, res, next) => {
  const user = await Users.findByEmail(req.body.email);
  if (user) {
    return res.status(HttpCode.CONFLICT).json({
      status: 'error',
      code: HttpCode.CONFLICT,
      data: { message: 'Email is in use' },
    });
  }
  try {
    const newUser = await Users.create(req.body);
    const { id, email, subscription, avatar, verifyTokenEmail } = newUser;
    try {
      const emailService = new EmailService(process.env.NODE_ENV);
      await emailService.sendVerificationEmail(verifyTokenEmail, email);
    } catch (error) {
      console.log(error.message);
    }
    return res.status(HttpCode.CREATED).json({
      status: 'success',
      code: HttpCode.CREATED,
      data: {
        user: {
          id,
          email,
          subscription,
          avatar,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await Users.findByEmail(email);
  const isPasswordValid = await user?.validPassword(password);
  if (!user || !isPasswordValid || !user.verify) {
    return res.status(HttpCode.UNAUTHORIZED).json({
      status: 'error',
      code: HttpCode.UNAUTHORIZED,
      data: {
        message: 'Email or password is wrong',
      },
    });
  }
  const payload = { id: user.id };
  const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: '1h' });
  await Users.updateToken(user.id, token);
  return res.status(HttpCode.OK).json({
    status: 'success',
    code: HttpCode.OK,
    data: {
      token: token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    },
  });
};

const logout = async (req, res, next) => {
  const id = req.user.id;
  await Users.updateToken(id, null);
  return res.status(HttpCode.NO_CONTENT).json({});
};

const getCurrentUser = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const user = await Users.findById(userId);
    if (user) {
      return res.json({
        status: 'success',
        code: 200,
        data: { user },
      });
    } else {
      return res.status(404).json({
        status: 'error',
        code: 404,
        data: { message: 'User is not found' },
      });
    }
  } catch (error) {
    next(error);
  }
};

const updateAvatar = async (req, res, next) => {
  const { id } = req.user;
  const avatarUrl = await saveUserAvatar(req);
  await Users.updateAvatar(id, avatarUrl);
  return res.status(HttpCode.OK).json({ status: 'success', code: HttpCode.OK, data: { avatarUrl } });
};

const saveUserAvatar = async req => {
  const FOLDER_AVATARS = process.env.FOLDER_AVATARS;
  const pathFile = req.file.path;
  const newAvatarName = `${Date.now().toString()}-${req.file.originalname}`;
  const img = await jimp.read(pathFile);
  await img
    .autocrop()
    .cover(250, 250, jimp.HORIZONTAL_ALIGN_CENTER | jimp.VERTICAL_ALIGN_MIDDLE)
    .writeAsync(pathFile);
  try {
    await fs.rename(pathFile, path.join(process.cwd(), 'public', FOLDER_AVATARS, newAvatarName));
  } catch (error) {
    console.log(error.message);
  }
  const oldAvatar = req.user.avatar;
  if (oldAvatar.includes(`${FOLDER_AVATARS}/`)) {
    await fs.unlink(path.join(process.cwd(), 'public', oldAvatar));
  }
  return path.join(FOLDER_AVATARS, newAvatarName);
};

const verify = async (req, res, next) => {
  try {
    console.log(req.params.verificationToken);
    const user = await Users.findByVerifyToken(req.params.verificationToken);
    if (user) {
      await Users.updateVerifyToken(user.id, true, null);
      return res.status(HttpCode.OK).json({
        status: 'success',
        code: HttpCode.OK,
        data: {
          message: 'Verification successful',
        },
      });
    }
    return res.status(HttpCode.NOT_FOUND).json({
      status: 'error',
      code: HttpCode.NOT_FOUND,
      data: {
        message: 'User not found',
      },
    });
  } catch (error) {
    next(error);
  }
};

const repeatEmailVerification = async (req, res, next) => {
  try {
    const user = await Users.findByEmail(req.body.email);
    if (user && !user.verify) {
      try {
        const { email, verifyTokenEmail } = user;
        const emailService = new EmailService(process.env.NODE_ENV);
        await emailService.sendVerificationEmail(verifyTokenEmail, email);
        return res.status(HttpCode.OK).json({
          status: 'success',
          code: HttpCode.OK,
          data: {
            message: 'Verification email sent',
          },
        });
      } catch (error) {
        console.log(error.message);
      }
    } else if (user && user.verify) {
      return res.status(HttpCode.BAD_REQUEST).json({
        status: 'error',
        code: HttpCode.BAD_REQUEST,
        data: {
          message: 'Verification has already been passed',
        },
      });
    } else if (!user) {
      return res.status(HttpCode.NOT_FOUND).json({
        status: 'error',
        code: HttpCode.NOT_FOUND,
        data: {
          message: 'User not found',
        },
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registration,
  login,
  logout,
  getCurrentUser,
  updateAvatar,
  verify,
  repeatEmailVerification,
};
