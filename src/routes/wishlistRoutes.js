const express = require("express");
const router = express.Router();
const wishlistControllers = require("../controllers/wishlistController");

router.post("/wishlists", wishlistControllers.createWishlist);
router.get(
  "/wishlists",
  wishlistControllers.getWishlists
);
router.get("/wishlists/:id", wishlistControllers.getWishlist);
router.put("/wishlists/:id", wishlistControllers.updateWishlist);
router.delete("/wishlists/:id", wishlistControllers.deleteWishlist);

module.exports = router;
