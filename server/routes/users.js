const express = require("express");
const usersController = require("../controllers/usersController");
const checkAuth = require("../middleware/checkAuth");
const checkAdmin = require("../middleware/checkAdmin");

const usersRouter = express.Router();

// весь раздел — только для администратора
usersRouter.use(checkAuth, checkAdmin);

usersRouter.get("/", usersController.getAll);
usersRouter.delete("/:id", usersController.remove);

module.exports = usersRouter;
