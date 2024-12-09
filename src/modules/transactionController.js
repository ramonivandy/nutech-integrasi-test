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

const getTransactionHistory = async (req, res) => {
  let { limit, offset } = req.query;
  let sql =
    "SELECT invoice_number, transaction_type, total_amount FROM transactions WHERE user_id = $1 ORDER BY created_on DESC LIMIT $2 OFFSET $3";
  let params = [req.decodedToken.id, limit, offset];

  const data = await db.query(sql, params);

  return res.status(200).json({
    status: 0,
    message: "Get History Berhasil",
    data: {
      offset: offset,
      limit: limit,
      records: data.rows,
    },
  });
};

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

  const updateBalanceUser = await updateBalance(
    req.decodedToken.id,
    "topup",
    req.body.top_up_amount
  );

  return res.json({
    status: 0,
    message: "Top Up Balance berhasil",
    data: {
      balance: updateBalanceUser.balance,
    },
  });
};

const postTransaction = async (req, res) => {
  const { service_code } = req.body;

  //get service tarif
  let sql =
    "SELECT service_code, service_name, service_tarif FROM services WHERE service_code = $1";
  let params = [service_code];
  const serviceData = await db.query(sql, params);

  if (serviceData.rows.length < 1) {
    return res.status(400).json({
      status: 102,
      message: "Service atau layanan tidak ditemukan",
      data: null,
    });
  }

  //get user balance
  sql = "SELECT balance FROM balances WHERE user_id = $1";
  params = [req.decodedToken.id];
  let balanceUser = await db.query(sql, params);

  //check if balance enough to make transaction
  balanceUser = Math.floor(balanceUser.rows[0].balance);
  serviceCost = Math.floor(serviceData.rows[0].service_tarif);

  if (balanceUser < serviceCost) {
    return res.status(402).json({
      status: 402,
      message: "Balance tidak mencukupi",
      data: null,
    });
  }

  // insert transaction
  sql =
    "INSERT INTO transactions (user_id, invoice_number, service_code, service_name, transaction_type, total_amount) VALUES ($1, $2, $3, $4, $5, $6) RETURNING invoice_number, service_code, service_name, transaction_type, total_amount, created_on";
  params = [
    req.decodedToken.id,
    generateInvoice(),
    serviceData.rows[0].service_code,
    serviceData.rows[0].service_name,
    "PAYMENT",
    serviceCost,
  ];
  const insertTransaction = await db.query(sql, params);

  // update balance user
  const updateBalanceUser = await updateBalance(
    req.decodedToken.id,
    "cost",
    serviceCost
  );

  return res.status(200).json({
    status: 0,
    message: "Transaksi berhasil",
    data: insertTransaction.rows,
  });
};

function generateInvoice() {
  const prefix = "INV";
  const randomPart = Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, "0"); // Ensures 6 digits
  return (prefix + randomPart).substring(0, 10); // Ensures max length 10
}

async function updateBalance(userId, type, amount) {
  // get current balance
  sql = "SELECT * FROM balances WHERE user_id = $1";
  params = [userId];
  const userBalance = await db.query(sql, params);

  let newBalance = 0;
  if (type === "topup") {
    newBalance = Math.floor(userBalance.rows[0].balance) + Math.floor(amount);
  } else {
    newBalance = Math.floor(userBalance.rows[0].balance) - Math.floor(amount);
  }

  sql = "UPDATE balances SET balance = $1 WHERE user_id = $2 RETURNING balance";
  params = [newBalance, userId];
  const updateBalance = await db.query(sql, params);

  return updateBalance.rows[0];
}

module.exports = {
  getBalance,
  getTransactionHistory,
  postTopup,
  postTransaction,
};
