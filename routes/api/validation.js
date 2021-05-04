const Joi = require('joi');

const schemaCreateContact = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'uk', 'ca', 'org'] } })
    .required(),
  phone: Joi.string()
    .pattern(new RegExp(/\(?([0-9]{3})\)?([ ]?)([0-9]{3})\2([0-9]{4})/))
    .required(),
});

const schemaUpdateContact = Joi.object({
  name: Joi.string().min(3).max(20).optional(),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'uk', 'ca', 'org'] } })
    .optional(),
  phone: Joi.string()
    .pattern(new RegExp(/^\(\d{3}\)\s?\d{3}-\d{4}$/))
    .optional(),
}).or('name', 'email', 'phone');

const schemaUpdateStatusContact = Joi.object({
  favorite: Joi.boolean().required(),
});

const validate = async (schema, obj, next) => {
  try {
    await schema.validateAsync(obj);
    return next();
  } catch (err) {
    console.log(err.message);
    next({ status: 400, message: err.message });
  }
};

module.exports = {
  validationCreateContact: async (req, res, next) => {
    return await validate(schemaCreateContact, req.body, next);
  },
  validationUpdateContact: async (req, res, next) => {
    return await validate(schemaUpdateContact, req.body, next);
  },
  validationUpdateStatusContact: async (req, res, next) => {
    return await validate(schemaUpdateStatusContact, req.body, next);
  },
};
