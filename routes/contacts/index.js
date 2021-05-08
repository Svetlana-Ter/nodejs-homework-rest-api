const express = require('express');
const router = express.Router();
const Contacts = require('../../model/contacts');
const { getAll, getById, create, update, remove, updateStatus } = require('../../controllers/contacts');
const { validationCreateContact, validationUpdateContact, validationUpdateStatusContact } = require('./validation');
const guard = require('../../helpers/guard');

router.get('/', guard, getAll);
router.post('/', guard, validationCreateContact, create);

router.get('/:contactId', guard, getById);
router.patch('/:contactId', guard, validationUpdateContact, update);
router.put('/:contactId', guard, validationUpdateContact, update);
router.delete('/:contactId', guard, remove);

router.patch('/:contactId/favorite', guard, validationUpdateStatusContact, updateStatus);

module.exports = router;
