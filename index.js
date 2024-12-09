const express = require("express");
const app = express();
const config = require("./src/helper/global_config");
const port = config.get("/port") || 3001;
const { connectDatabase } = require("./src/helper/database/index");
const membershipRoute = require("./src/routes/membershipRoute");
const informationRoute = require("./src/routes/informationRoute");

app.get("/", (req, res) => {
  return res.status(200).json({
    message: "This server is running properly",
  });
});
app.use("/uploads", express.static("uploads"));

// Database connection pool
connectDatabase();

// application/json parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", membershipRoute);
app.use("/", informationRoute);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
