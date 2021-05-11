const Joi = require('joi');

const schemaRegistrationUser = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'uk', 'ca', 'org', 'ua'] } })
    .required(),
  password: Joi.string()
    .pattern(/^[a-zA-Z0-9]{3,30}$/)
    .required(),
  subscription: Joi.string().optional(),
});

const schemaLoginUser = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'uk', 'ca', 'org', 'ua'] } })
    .required(),
  password: Joi.string()
    .pattern(/^[a-zA-Z0-9]{3,30}$/)
    .required(),
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
  validationLoginUser: async (req, res, next) => {
    return await validate(schemaLoginUser, req.body, next);
  },
  validationRegistrationUser: async (req, res, next) => {
    return await validate(schemaRegistrationUser, req.body, next);
  },
};
