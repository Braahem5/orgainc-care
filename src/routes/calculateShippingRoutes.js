const express = require("express");
const router = express.Router();
const shippingOptionValidation = require("./middlewares/shippingOptionValidation");
const  shippingRate  = require("../controllers/calculateShippingRateController");

router.get("/calculate-shipping-rate", shippingOptionValidation, shippingRate);

module.exports = router;
