const { v4: uuidv4 } = require('uuid');
const fs = require('fs').promises;
const path = require('path');
const contactsPath = path.join(__dirname, 'contacts.json');
const contacts = require('./contacts.json');

const listContacts = () => {
  return contacts;
};

const getContactById = async contactId => {
  const contact = contacts.find(item => item.id.toString() === contactId);
  return contact;
};

const removeContact = async contactId => {
  const deletedContact = await getContactById(contactId);
  const filteredContacts = contacts.filter(item => item.id.toString() !== contactId);
  await fs.writeFile(contactsPath, JSON.stringify(filteredContacts));
  return deletedContact;
};

const addContact = async body => {
  const id = uuidv4();
  const contact = {
    id,
    ...body,
  };
  const newContacts = [...contacts, contact];
  await fs.writeFile(contactsPath, JSON.stringify(newContacts));
  return contact;
};

const updateContact = async (contactId, body) => {
  const contactToUpdate = await getContactById(contactId);
  Object.assign(contactToUpdate, body);
  await fs.writeFile(contactsPath, JSON.stringify(contacts));
  return contactToUpdate.id ? contactToUpdate : null;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
