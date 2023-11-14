const ProductViewed = require("../models/productViewed");

//Create viewed product
const viewedProduct = async (req, res) => {
  try {
    const { userId, productId } = req.body;
    const timestamp = new Date();

    const productViewed = new ProductViewed({ userId, productId, timestamp });
    await productViewed.save();
    if (!productViewed) {
      throw new Error("Failed to create a view product history");
    }

    res.status(201).json({ message: "Product view recorded successfully" });
  } catch (error) {
    console.log("Error in saving viewed  product", error);
    res.status(500).json({ message: "Error recording product view" });
  }
};
//get viewed product

const getViewedProducts = async (req, res) => {
  try {
    const userId = req.query?.user_id;
    const products = await ProductViewed.find({userId: userId}).sort("-timestamp").exec();
    if (!products) {
      throw new Error("No viewed product found");
    }
    res.status(200).json(products);
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "There was an error fetching viewed data" });
  }
};

module.exports = {
  viewedProduct,
  getViewedProducts,
};
