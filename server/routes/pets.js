const express = require("express");
const petsController = require("../controllers/petsController");
const checkAuth = require("../middleware/checkAuth");

const petsRouter = express.Router();

// все запросы к питомцам — только для вошедших пользователей
petsRouter.use(checkAuth);

petsRouter.get("/", petsController.getAll);
petsRouter.get("/:id", petsController.getOne);
petsRouter.post("/", petsController.create);
petsRouter.put("/:id", petsController.update);
petsRouter.delete("/:id", petsController.remove);

module.exports = petsRouter;
