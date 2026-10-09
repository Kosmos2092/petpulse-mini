const express = require("express");
const authController = require("../controllers/authController");
const checkAuth = require("../middleware/checkAuth");

const authRouter = express.Router();

authRouter.post("/register", authController.register);
authRouter.post("/login", authController.login);
authRouter.post("/logout", checkAuth, authController.logout);
authRouter.get("/me", checkAuth, authController.me);

module.exports = authRouter;
