const db = require("../helper/database/index");
const jwt = require("../helper/auth/index");
const bcrypt = require("bcrypt");
const fs = require("fs");
const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

const getBanner = async (req, res) => {
  let sql = "SELECT banner_name, banner_image, description FROM banner";

  const data = await db.query(sql);

  return res.json({
    status: 0,
    message: "Sukses",
    data: data.rows,
  });
};

const getServices = async (req, res) => {
  let sql =
    "SELECT service_code, service_name, service_icon, service_tarif FROM services";

  const data = await db.query(sql);

  return res.json({
    status: 0,
    message: "Sukses",
    data: data.rows,
  });
};

module.exports = {
  getBanner,
  getServices,
};
