const express = require("express");
const appointmentsController = require("../controllers/appointmentsController");
const checkAuth = require("../middleware/checkAuth");

const appointmentsRouter = express.Router();

// все запросы к записям — только для вошедших пользователей
appointmentsRouter.use(checkAuth);

appointmentsRouter.get("/", appointmentsController.getAll);
appointmentsRouter.post("/", appointmentsController.create);
appointmentsRouter.delete("/:id", appointmentsController.remove);

module.exports = appointmentsRouter;
