const db = require("../helper/database/index");
const fs = require("fs");
const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

const getBalance = async (req, res) => {
  let sql = "SELECT balance FROM balances WHERE user_id = $1";
  let params = [req.decodedToken.id];

  const data = await db.query(sql, params);

  if (data.rows.length < 1) {
    // balance user data not found, create it.
    sql =
      "INSERT INTO balances (user_id, balance) VALUES ($1, $2) RETURNING balance";
    params = [req.decodedToken.id, 0];
    const insert = await db.query(sql, params);
    data.rows[0] = insert.rows[0];
  }

  return res.json({
    status: 0,
    message: "Sukses",
    data: data.rows[0],
  });
};

const getTransactionHistory = async (req, res) => {};
const postTopup = async (req, res) => {};
const postTransaction = async (req, res) => {};

module.exports = {
  getBalance,
  getTransactionHistory,
  postTopup,
  postTransaction,
};
