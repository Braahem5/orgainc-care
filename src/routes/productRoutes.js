const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const userAuthMiddleware = require("./middlewares/authMIddleware");
const checkUserRole = require("../utils/roleBaseAuth/checkUserRole");

router.post(
  "/product",
  userAuthMiddleware,
  checkUserRole("admin"),
  productController.createProduct
);
router.get("/products", productController.getProducts);
router.get("/product/:id", productController.getProduct);
router.put(
  "/product/:id",
  userAuthMiddleware,
  checkUserRole("admin"),
  productController.updateProduct
);
router.delete(
  "/product/:id",
  userAuthMiddleware,
  checkUserRole("admin"),
  productController.deleteProduct
);

module.exports = router;
