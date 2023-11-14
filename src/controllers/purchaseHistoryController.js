const PurchaseHistory = require("../models/PurchaseHistory");
const logger = require("../utils/logger/logger");

const createPurchaseHistory = async (req, res) => {
  try {
    const { userId, productId } = req.body;
    const purchaseDate = new Date();

    const purchase = new PurchaseHistory.find({
      userId,
      productId,
      purchaseDate,
    });
    await purchase.save();
    if (!purchase) {
      throw new Error("Failed to record purchase");
    }
    return res.status(201).json({ message: "Purchase recorded successfully" });
  } catch (error) {
    console.log(error);
    logger.error("Failed to record purchase", error);
    res.status(500).json({ message: "Error recording purchase" });
  }
};

const getPurchaseHistory = async (req, res) => {
  try {
    const userId = req.query?.user_Id
    const purchase = new PurchaseHistory.find({userId: userId}).sort("-createdAt").populate({
      path: "product",
      model: "Product",
    });
    const purchases = await purchase.exec();
    if (!purchases || purchases.length === 0) {
      throw new Error("No purchases found");
    }
    return res.status(200).json(purchases);
  } catch (err) {
    console.log(err);
    logger.error("Failed to fetch purchases", error);
    res.status(500).json({ message: "fetching purchase" });
  }
};

module.exports= {
    createPurchaseHistory,
    getPurchaseHistory
}
