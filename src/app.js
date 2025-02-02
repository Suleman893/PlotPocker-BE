const express = require("express");
const AppRoutes = require("./api");
const colors = require("./loaders/colors");
const config = require("./config");
const { appMiddlewares } = require("./loaders");
const app = express();
//controllers
const allController = require("./controllers/all.controller");
//loaders
require("dotenv").config();

//Stripe webhook, due to application/json

//[APP] Stripe webhook
app.post(
  "/plotpocket/api/v1/stripe-webhook",
  express.raw({ type: "application/json" }),
  allController.stripeWebhook
);

//Middlewares
appMiddlewares(app);
require("express-async-errors");

//initial route
app.get("/", (req, res) => {
  res.send("Initial route running...");
});

//AWS health check route
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

app.use("/plotpocket/api/v1", AppRoutes);

app.use((req, res) => {
  res.status(404).json({
    status: "404",
    message: "Route not found",
  });
});

app.use((err, req, res, next) => {
  console.log("The error", err);
  if (err.code === "UNSUPPORTED_FILE_TYPE") {
    return res.status(400).json({ status: "400", message: err.message });
  }
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ status: "500", message: err.message });
  }
  res.status(500).json({
    status: "500",
    message: `Unexpected Error: ${err}`,
  });
});

//Starting server
async function startServer() {
  app
    .listen(config.port, () => {
      console.log(
        colors.fg.cyan,
        `
        ########################################
        🛡️  Server is listening on port: ${config.port}  🛡️
        ########################################
        `,
        colors.reset
      );
    })
    .on("error", (err) => {
      console.log("Server starting error: ", err);
      process.exit(1);
    });
}

startServer();
