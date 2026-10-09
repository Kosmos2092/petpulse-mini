const express = require("express");
const vetsController = require("../controllers/vetsController");
const checkAuth = require("../middleware/checkAuth");
const checkAdmin = require("../middleware/checkAdmin");

const vetsRouter = express.Router();

// смотреть каталог может кто угодно, даже гость
vetsRouter.get("/", vetsController.getAll);
vetsRouter.get("/:id", vetsController.getOne);

// добавлять, менять и удалять врачей — только администратор: сначала checkAuth (вошёл?), потом checkAdmin (админ?)
vetsRouter.post("/", checkAuth, checkAdmin, vetsController.create);
vetsRouter.put("/:id", checkAuth, checkAdmin, vetsController.update);
vetsRouter.delete("/:id", checkAuth, checkAdmin, vetsController.remove);

module.exports = vetsRouter;
