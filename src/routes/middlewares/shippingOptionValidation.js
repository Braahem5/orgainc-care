const { check, validationResult } = require("express-validator");
const shippingOptionValidation = [
  check("shippingMethod").isString(),
  check("region").isString(),
  check("isInternational").isBoolean(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = shippingOptionValidation;
