const express = require('express');
const routes = express.Router();
const calendarController = require("../controllers/calendarController");
const { verify } = require('../middlewares/verifyToken');

// Rota
routes.post("/calendar", verify ,calendarController.calendar);
routes.post("/altCalendar", calendarController.updateCalendar);
routes.get("/getDates", calendarController.getCalendar);

// Exportar
module.exports = routes;