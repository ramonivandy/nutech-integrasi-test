const { Router } = require("express");
const router = Router();
const transactionController = require("../modules/transactionController");
const jwt = require("../helper/auth/index");
const upload = require("../helper/upload_files/index");

router.get("/balance", jwt.verifyToken, transactionController.getBalance);
router.get(
  "/transaction/history",
  jwt.verifyToken,
  transactionController.getTransactionHistory
);

router.post("/topup", jwt.verifyToken, transactionController.postTopup);
router.post(
  "/transaction",
  jwt.verifyToken,
  transactionController.postTransaction
);

module.exports = router;
