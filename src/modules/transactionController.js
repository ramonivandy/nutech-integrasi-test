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
const postTopup = async (req, res) => {
  // create transaction
  let sql =
    "INSERT INTO transactions (user_id, invoice_number, service_code, service_name, transaction_type, total_amount) VALUES ($1, $2, $3, $4, $5, $6)";
  let params = [
    req.decodedToken.id,
    generateInvoice(),
    "TOPUP",
    "TOPUP",
    "TOPUP",
    req.body.top_up_amount,
  ];
  const insertTransaction = await db.query(sql, params);

  // update balance user
  // get current balance
  sql = "SELECT * FROM balances WHERE user_id = $1";
  params = [req.decodedToken.id];
  const userBalance = await db.query(sql, params);

  // add balance
  console.log(userBalance);

  let newBalance =
    Math.floor(userBalance.rows[0].balance) +
    Math.floor(req.body.top_up_amount);

  sql = "UPDATE balances SET balance = $1 WHERE user_id = $2 RETURNING balance";
  params = [newBalance, req.decodedToken.id];
  const updateBalance = await db.query(sql, params);

  return res.json({
    status: 0,
    message: "Top Up Balance berhasil",
    data: {
      balance: updateBalance.rows[0].balance,
    },
  });
};
const postTransaction = async (req, res) => {};

function generateInvoice() {
  const prefix = "INV";
  const randomPart = Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, "0"); // Ensures 6 digits
  return (prefix + randomPart).substring(0, 10); // Ensures max length 10
}

module.exports = {
  getBalance,
  getTransactionHistory,
  postTopup,
  postTransaction,
};
