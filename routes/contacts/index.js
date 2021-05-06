const express = require('express');
const router = express.Router();
const Contacts = require('../../model/contacts');
const { getAll, getById, create, update, remove, updateStatus } = require('../../controllers/contacts');
const { validationCreateContact, validationUpdateContact, validationUpdateStatusContact } = require('./validation');

router.get('/', getAll);
router.post('/', validationCreateContact, create);

router.get('/:contactId', getById);
router.patch('/:contactId', validationUpdateContact, update);
router.put('/:contactId', validationUpdateContact, update);
router.delete('/:contactId', remove);

router.patch('/:contactId/favorite', validationUpdateStatusContact, updateStatus);

module.exports = router;
