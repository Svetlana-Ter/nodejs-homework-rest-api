const Contacts = require('./schemas/contact');

const listContacts = async () => {
  const result = await Contacts.find({});
  return result;
};

const getContactById = async contactId => {
  return await Contacts.findOne({ _id: contactId });
};

const removeContact = async contactId => {
  return await Contacts.findByIdAndRemove(contactId);
};

const addContact = async body => {
  return await Contacts.create(body);
};

const updateContact = async (contactId, body) => {
  const result = Contacts.findByIdAndUpdate({ _id: contactId }, { ...body }, { new: true });
  return result;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
