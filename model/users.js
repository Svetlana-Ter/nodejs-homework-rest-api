const Users = require('./schemas/user');

const findById = async id => {
  return await Users.findOne({ _id: id });
};

const findByEmail = async email => {
  return await Users.findOne({ email });
};

const findByVerifyToken = async token => {
  return await Users.findOne({ verifyTokenEmail: token });
};

const create = async userOptions => {
  const user = new Users(userOptions);
  return await user.save();
};

const updateToken = async (id, token) => {
  return await Users.updateOne({ _id: id }, { token });
};

const updateAvatar = async (id, avatarUrl) => {
  return await Users.updateOne({ _id: id }, { avatar: avatarUrl });
};

const updateVerifyToken = async (id, verify, verificationToken) => {
  return await Users.updateOne({ _id: id }, { verify, verifyTokenEmail: verificationToken });
};

module.exports = {
  findById,
  findByEmail,
  findByVerifyToken,
  create,
  updateToken,
  updateAvatar,
  updateVerifyToken,
};
