const db = require("../helper/database/index");
const jwt = require("../helper/auth/index");
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");
const membershipSchema = require("../models/membershipModel");
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

    return res.status(400).json({
      status: 102,
      message: errorMessages,
    });
  }

  bcrypt.hash(value.password, saltRounds, async function (err, hash) {
    if (err) {
      return res.status(500).json({
        status: 500,
        message: "Failed to hash password",
      });
    }

    // Check if email already exists
    let sql =
      "SELECT id, email, first_name, last_name, password FROM membership WHERE email = $1 LIMIT (1)";
    let params = [value.email];
    let data = await db.query(sql, params);

    if (data.rows.length > 0) {
      return res.status(400).json({
        status: 102,
        message: "Email telah digunakan.",
        data: null,
      });
    }

    // Prepare sql and values
    sql =
      "INSERT INTO membership(email, first_name, last_name, password) VALUES($1, $2, $3, $4) RETURNING *";
    const values = [value.email, value.first_name, value.last_name, hash];

    // Insert data to database
    const insert = await db.query(sql, values);

    res.status(200).json({
      status: 0,
      message: "Registrasi berhasil silakan login.",
      data: null,
    });
  });
};

const postLogin = async (req, res) => {
  // Validate body data
  const { error, value } = membershipSchema.membershipLogin.validate(
    req.body,
    { abortEarly: false } // Get all validate error
  );

  if (error) {
    // Collect all error messages
    const errorMessages = error.details.map((err) => err.message);

    return res.status(422).json({
      status: 102,
      message: errorMessages,
    });
  }

  // Check user exists
  let sql =
    "SELECT id, email, first_name, last_name, password FROM membership WHERE email = $1 LIMIT (1)";
  let params = [value.email];
  let data = await db.query(sql, params);

  if (data.rows.length < 1) {
    return res.status(401).json({
      status: 103,
      message: "Email atau password salah.",
      data: null,
    });
  }

  // Check password correct or incorrect
  data = data.rows[0];
  bcrypt.compare(value.password, data.password, async function (err, result) {
    if (err) {
      return res.status(500).json({
        status: 500,
        message: "Failed validate password",
      });
    }

    if (!result) {
      return res.status(401).json({
        status: 103,
        message: "Email atau password salah.",
      });
    }

    // Only proceed to generate a token if password comparison is successful
    try {
      delete data.password;
      const token = await jwt.generateToken(data);
      return res.status(200).json({
        status: 0,
        message: "Login Sukses",
        data: {
          token: token,
        },
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: "Failed to generate token",
      });
    }
  });
};

const getProfile = async (req, res) => {
  let sql =
    "SELECT email, first_name, last_name, profile_image FROM membership WHERE email = $1";
  let params = [req.decodedToken.email];

  const data = await db.query(sql, params);
  if (data.rows.length < 1) {
    return res.status(401).json({
      status: 103,
      message: `Akun dengan email ${req.decodedToken.email} tidak ditemukan`,
      data: null,
    });
  }

  return res.json({
    status: 0,
    message: "Sukses",
    data: data.rows[0],
  });
};

const updateProfileImage = async (req, res) => {
  let sql,
    params = "";
  const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
  const profile_image = `${BASE_URL}/${req.file.path}`;

  sql = "SELECT profile_image FROM membership WHERE email = $1";
  params = [req.decodedToken.email];
  const data = await db.query(sql, params);

  if (data.rows.length < 1) {
    return res.status(401).json({
      status: 103,
      message: `Akun dengan email ${req.decodedToken.email} tidak ditemukan`,
      data: null,
    });
  }

  if (data.rows[0].profile_image) {
    try {
      const fullPath = `./${data.rows[0].profile_image}`;
      fs.unlinkSync(fullPath);
    } catch (err) {
      return res.status(500).json({
        status: 500,
        message: "Failed to remove old profile picture.",
        data: null,
      });
    }
  }

  sql =
    "UPDATE membership SET profile_image = $1 WHERE email = $2 RETURNING email, first_name, last_name, profile_image";
  params = [req.file.path, req.decodedToken.email];
  const update = await db.query(sql, params);

  update.rows[0].profile_image = profile_image;
  return res.json({
    status: 0,
    message: "Upload Profile Image berhasil",
    data: update.rows[0],
  });
};

module.exports = {
  postRegistration,
  postLogin,
  getProfile,
  updateProfileImage,
};
