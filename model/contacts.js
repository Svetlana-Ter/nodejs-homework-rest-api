const Contacts = require('./schemas/contact');

const listContacts = async userId => {
  const result = await Contacts.find({ owner: userId }).populate({ path: 'owner', select: 'email subscription' });
  return result;
};

const getContactById = async (userId, contactId) => {
  return await Contacts.findOne({ _id: contactId, owner: userId }).populate({
    path: 'owner',
    select: 'email subscription',
  });
};

const removeContact = async (userId, contactId) => {
  return await Contacts.findByIdAndRemove({ _id: contactId, owner: userId });
};

const addContact = async (userId, body) => {
  return await Contacts.create({ ...body, owner: userId });
};

const updateContact = async (userId, contactId, body) => {
  const result = Contacts.findByIdAndUpdate({ _id: contactId, owner: userId }, { ...body }, { new: true });
  return result;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
