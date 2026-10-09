const express = require("express");
const vetsController = require("../controllers/vetsController");

// Здесь только адреса: какой запрос какой функцией контроллера обрабатывается
const vetsRouter = express.Router();

vetsRouter.get("/", vetsController.getAll);
vetsRouter.get("/:id", vetsController.getOne);

module.exports = vetsRouter;
