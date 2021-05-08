const Contacts = require('../model/contacts');

const getAll = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const contacts = await Contacts.listContacts(userId);
    return res.json({
      status: 'success',
      code: 200,
      data: { contacts },
    });
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const contact = await Contacts.getContactById(userId, req.params.contactId);
    if (contact) {
      return res.json({
        status: 'success',
        code: 200,
        data: { contact },
      });
    } else {
      return res.status(404).json({
        status: 'error',
        code: 404,
        data: { message: 'Not found' },
      });
    }
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const contact = await Contacts.addContact(userId, req.body);
    return res.status(201).json({
      status: 'success',
      code: 201,
      data: { contact },
    });
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const contact = await Contacts.updateContact(userId, req.params.contactId, req.body);
    if (contact) {
      return res.json({
        status: 'success',
        code: 200,
        data: { contact },
      });
    } else {
      return res.status(404).json({
        status: 'error',
        code: 404,
        data: { message: 'Not found' },
      });
    }
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const contact = await Contacts.removeContact(userId, req.params.contactId);
    if (contact) {
      return res.json({
        status: 'success',
        code: 200,
        data: { message: 'contact deleted' },
      });
    } else {
      return res.status(404).json({
        status: 'error',
        code: 404,
        data: { message: 'Not found' },
      });
    }
  } catch (err) {
    next(err);
  }
};

const updateStatus = async (req, res, next) => {
  if (!req.body.favorite) {
    return res.json({
      status: 'error',
      code: 400,
      data: { message: 'Missing field favorite' },
    });
  } else {
    try {
      const userId = req.user?.id;
      const contact = await Contacts.updateContact(userId, req.params.contactId, req.body);
      if (contact) {
        return res.json({
          status: 'success',
          code: 200,
          data: { contact },
        });
      } else {
        return res.status(404).json({
          status: 'error',
          code: 404,
          data: { message: 'Not found' },
        });
      }
    } catch (err) {
      next(err);
    }
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
  updateStatus,
};
