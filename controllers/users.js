const Users = require('../model/users');
const { HttpCode } = require('../helpers/constants');
const jwt = require('jsonwebtoken');
require('dotenv').config();
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

module.exports = {
  registration,
  login,
  logout,
  getCurrentUser,
};
