const Joi = require("joi");

const membershipRegistration = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),
  first_name: Joi.string().alphanum().required(),
  last_name: Joi.string().alphanum().required(),
  password: Joi.string().min(8).max(30).required(),
});

const membershipLogin = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().alphanum().required(),
});

const membershipUpdate = Joi.object({
  first_name: Joi.string().alphanum().min(1).optional(),
  last_name: Joi.string().alphanum().min(1).optional(),
});

module.exports = {
  membershipRegistration,
  membershipLogin,
  membershipUpdate,
};
