const express = require("express");
const routes = express.Router();
const transferController = require("../controllers/transferController");

// Rota
routes.post("/transfers/send", transferController.transferencia);
routes.get("/transferOrders/:id", transferController.getNotifications);
routes.get("/transfers/processes/:id", transferController.getProcessesInTransfer);
routes.post("/transfers/accept/:id", transferController.acceptTransfer);

// Exportar
module.exports = routes;
