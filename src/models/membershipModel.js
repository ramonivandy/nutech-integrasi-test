const Joi = require("joi");

const membershipRegistration = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .message({
      "string.base": `"email" should be a type of text`,
      "string.empty": `"email" should not empty`,
      "string.email": `"email" should be email format`,
    }),
  first_name: Joi.string().alphanum(),
  last_name: Joi.string().alphanum(),
  password: Joi.string().min(8).max(30),
});

module.exports = {
  membershipRegistration,
};
