const express = require("express");
const vetsController = require("../controllers/vetsController");

// каталог врачей открыт всем, вход не нужен
const vetsRouter = express.Router();

vetsRouter.get("/", vetsController.getAll);
vetsRouter.get("/:id", vetsController.getOne);

module.exports = vetsRouter;
