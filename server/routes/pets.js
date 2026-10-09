const express = require("express");
const petsController = require("../controllers/petsController");

// Здесь только адреса: какой запрос какой функцией контроллера обрабатывается
const petsRouter = express.Router();

petsRouter.get("/", petsController.getAll);
petsRouter.get("/:id", petsController.getOne);
petsRouter.post("/", petsController.create);
petsRouter.put("/:id", petsController.update);
petsRouter.delete("/:id", petsController.remove);

module.exports = petsRouter;
