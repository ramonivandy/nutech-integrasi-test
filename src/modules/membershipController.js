const db = require("../helper/database/index");
const membershipSchema = require("../models/membershipModel");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const postRegistration = async (req, res) => {
  // Validate body data
  const { error, value } = membershipSchema.membershipRegistration.validate(
    req.body,
    { abortEarly: false } // Get all validate error
  );

  if (error) {
    // Collect all error messages
    const errorMessages = error.details.map((err) => err.message);

    return res.status(422).json({
      success: false,
      message: errorMessages,
    });
  }

  bcrypt.hash(value.password, saltRounds, async function (err, hash) {
    if (err) {
      return res.status(422).json({
        success: false,
        message: "Failed to hash password",
      });
    }

    // Prepare sql and values
    let sql =
      "INSERT INTO membership(email, first_name, last_name, password) VALUES($1, $2, $3, $4) RETURNING *";
    const values = [value.email, value.first_name, value.last_name, hash];

    // Insert data to database
    const insert = await db.query(sql, values);

    res.status(200).json({
      success: true,
      data: insert.rows[0],
    });
  });
};

module.exports = {
  postRegistration,
};
