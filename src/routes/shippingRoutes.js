const express = require("express");
const router = express.Router();
const shippingController = require("../controllers/shippingController");

router.post("/shippingOption", shippingController.createUserShippingOption);
router.get(
  "/getShippingOption/:shippingId",
  shippingController.getUserShppingOption
);
router.put(
  "/updateShippingOption/:shippingId",
  shippingController.updateUserShppingOption
);
router.delete(
  "/deleteShippingOption/:shippingId",
  shippingController.deleteUserShppingOption
);

module.exports = router;
