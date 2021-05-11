require('dotenv').config();
const jimp = require('jimp');
const fs = require('fs/promises');
const path = require('path');
const jwt = require('jsonwebtoken');
const Users = require('../model/users');
const { HttpCode } = require('../helpers/constants');
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const registration = async (req, res, next) => {
  const { email } = req.body;
  const user = await Users.findByEmail(email);
  if (user) {
    return res.status(HttpCode.CONFLICT).json({
      status: 'error',
      code: HttpCode.CONFLICT,
      data: { message: 'Email is in use' },
    });
  }
  try {
    const newUser = await Users.create(req.body);
    return res.status(HttpCode.CREATED).json({
      status: 'success',
      code: HttpCode.CREATED,
      data: {
        user: {
          id: newUser.id,
          email: newUser.email,
          subscription: newUser.subscription,
          avatar: newUser.avatar,
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
  if (!user || !isPasswordValid) {
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

module.exports = {
  registration,
  login,
  logout,
  getCurrentUser,
  updateAvatar,
};
