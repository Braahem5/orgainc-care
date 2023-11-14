const express = require("express");
const router = express.Router();
const order = require("../controllers/orderController")
const checkUserRole = require("../utils/roleBaseAuth/checkUserRole");

router.post("/orders", order.createOrder);
router.get("/orders",checkUserRole("admin"), order.getOrders);
router.get("order/:orderId", order.getOrder);
router.put("/status/:orderId", order.updateStatus);

module.exports = router;