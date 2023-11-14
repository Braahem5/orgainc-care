const Wishlist = require("../models/WishList");
const logger = require("../utils/logger/logger");
const { validationResult, check } = require("express-validator");

const INTERNAL_SERVER_ERROR_MESSAGE = "Internal Server Error";
const NO_WISHLISTS_FOUND_MESSAGE = "No wishlists found.";
const NO_WISHLIST_WITH_ID_MESSAGE = "No wishlist with that Id was found.";

const logError = (message, error) => {
  console.error(`${message}: ${error.message}`);
  logger.error(`${message}: ${error.message}`);
};

const createWishlist = async (req, res) => {
  try {
    const { userId, items } = req.body;
    const wishlist = new Wishlist({ userId, items });
    await wishlist.save();
    return res.status(201).json(wishlist);
  } catch (error) {
    logError("Error in creating wishlist", error);

    let statusCode = 500;
    let errorMessage = INTERNAL_SERVER_ERROR_MESSAGE;

    if (error.name === "ValidationError") {
      statusCode = 400;
      errorMessage = `Validation Error: ${error.message}`;
    }

    return res.status(statusCode).json({ message: errorMessage });
  }
};

const getWishlists = async (req, res) => {
  try {
    const userId = req.query.userId;
    const wishlists = await Wishlist.find(userId)
      .sort("-createdAt")
      .populate({
        path: "items",
        model: "Product",
      })
      .exec();

    if (wishlists.length === 0) {
      return res.status(200).json({ message: NO_WISHLISTS_FOUND_MESSAGE });
    }

    res.status(200).json(wishlists);
  } catch (error) {
    logError("Error in getting wishlists", error);
    return res.status(500).json({ message: INTERNAL_SERVER_ERROR_MESSAGE });
  }
};

const getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({
      userId: req.query.userId,
      items: req.params.id,
    })
      .sort("-createdAt")
      .populate({
        path: "items",
        model: "Product",
      })
      .exec();

    if (!wishlist) {
      return res.status(200).json({ message: NO_WISHLISTS_FOUND_MESSAGE });
    }

    return res.status(200).json(wishlist);
  } catch (error) {
    logError("Error in getting wishlist", error);
    return res
      .status(500)
      .json({ error: INTERNAL_SERVER_ERROR_MESSAGE, message: error.message });
  }
};

const updateWishlist = async (req, res) => {
  try {
    const validationRules = [
      check("userId").isString().notEmpty(),
      check("items").isArray(),
    ];

    await Promise.all(validationRules.map((validation) => validation(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userId, items } = req.body;
    const wishlist = await Wishlist.findOneAndUpdate(
      {
        userId: req.query.userId,
        items: req.params.id,
      },
      { items },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!wishlist) {
      throw new Error(NO_WISHLIST_WITH_ID_MESSAGE);
    }

    return res.status(200).json(wishlist);
  } catch (error) {
    logError("Error in updating wishlist", error);
    return res
      .status(404)
      .json({ error: NO_WISHLIST_WITH_ID_MESSAGE, message: error.message });
  }
};

const deleteWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.deleteOne({
      userId: req.query.userId,
      items: req.params.id,
    });

    if (wishlist.deletedCount === 0) {
      res.status(404).json({ error: NO_WISHLIST_WITH_ID_MESSAGE });
    }

    return res.status(200).json({
      message: "Successfully deleted the wishlist!",
      data: wishlist,
    });
  } catch (error) {
    logError("Error in deleting wishlist", error);
    return res
      .status(500)
      .json({ error: INTERNAL_SERVER_ERROR_MESSAGE, message: error.message });
  }
};

module.exports = {
  createWishlist,
  getWishlists,
  getWishlist,
  updateWishlist,
  deleteWishlist,
};
