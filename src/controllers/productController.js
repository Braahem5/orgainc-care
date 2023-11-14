//handling of the product creation and the price in multiple currency
const Product = require("../models/Product");
const convertCurrency = require("../services/currencyConverter");
const logger = require("../utils/logger/logger");

const isvalidCurrency = (currencyCode) => {
  if (typeof currencyCode !== "string") {
    return false;
  }
  const trimmedCode = currencyCode.trim();
  const upperCaseCode = trimmedCode.toUpperCase();
  return upperCaseCode;
};

// create new product in the database
const createProduct = async (req, res) => {
  const { name, imageUrl, description, price } = req.body;
  const product = new Product({ name, imageUrl, description, price });
  try {
    await product.save();
    res.status(201).send({ product });
  } catch (error) {
    res.status(409).send({ message: error.errors });
  }
};

// get all products from the database
const getProducts = async (req, res) => {
  try {

    //to save user currency
    const userPreferredCurrency = req.query?.currency;

    // Fetch products from the database, sorted by createdAt
    const products = await Product.find().exec();
    if (products.length === 0) {
      throw new Error("No Product Available");
    }
    logger.info("Products fetched successfully");

    // Validate the user's preferred currency
    if (!isvalidCurrency(userPreferredCurrency)) {
      logger.error("Invalid currency code");
      return res.status(400).json({ message: "Invalid currency code" });
    }

    const convertedProducts = [];
    //updated the price in the user preferred currency
    for (const product of products) {
      // Check if the user's preferred currency is not equal product's curerency
      if (userPreferredCurrency !== product.currency) {
        try {
          const convertedPrice = await convertCurrency(
            product.price,
            product.currency,
            userPreferredCurrency
          );
          // Update product's price and currency
          if (convertedPrice && convertedPrice[0] !== undefined) {
            product.price = convertedPrice[0]; // Converted price
            product.currency = userPreferredCurrency;
          } else {
            throw new Error("Currency conversion failed for products.");
          }
          logger.info(`Price converted for product with ID: ${product._id}`);
          convertedProducts.push(product);
        } catch (error) {
          // Log an error for currency conversion failure
          logger.error("Currency conversion failed for products", error);
          console.error("Currency conversion error", error);
        }
      } else {
        convertedProducts.push(product);
      }
    }

    // Log an info message
    logger.info("Products converted to user preferred currency");

    if (convertedProducts.length === 0) {
      // Log an error when no products are available in the user's local currency
      logger.error("No Product Available in user Currency Conversion");
      throw new Error("No Products Available in user local currency");
    }

    logger.info("Sending converted products to the client")
    res.status(200).json(convertedProducts);
  } catch (error) {
    logger.error("Error obtaining thr products", error)
    console.log(error);
    res.status(500).send({ message: "Error obtaining the products" });
  }
};

//get a product from the database
const getProduct = async (req, res) => {
  const id = req.params.id;
  try {
    //to save user currency
    const userPreferredCurrency = req.query?.preferredCurrency;
    const product = await Product.findById(id).exec();

    if (product.length === 0) {
      throw new Error("Product Not found");
    }
    // Validate the user's preferred currency
    if (!isvalidCurrency(userPreferredCurrency)) {
      return res.status(400).send("Invalid Currency");
    }
    const convertedProduct = {};
    if (!userPreferredCurrency || userPreferredCurrency === "USD") {
      try {
        const convertedPrice = await convertCurrency(
          product.price,
          product.currency,
          userPreferredCurrency
        );
        if (convertedPrice && convertedPrice[0] !== undefined) {
          convertedProduct.price = convertedPrice[0]; // Converted price
          convertedProduct.currency = userPreferredCurrency;
        } else {
          throw new Error("Currency conversion failed for product.");
        }
        logger.info(`Price converted for product with ID: ${product._id}`);
        convertedProduct = product;
      } catch (error) {
        console.error("Currency conversion error", error);
      }
    } else {
      convertedProduct = product;
    }

    if (convertedProduct === undefined || null ){
      // Log an error when no products are available in the user's local currency
      logger.error("No Product Available in user Currency Conversion");
      throw new Error("Converted product not available");
    }

    logger.info("Sending converted product to the client");
    res.status(200).json(convertedProduct);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Error obtaining the products" });
  }
};

//update a product in the database 
const updateProduct = async (req, res) => {
  const id = req.params.id;
  const { name, description, price } = req.body;
  let product;
  try {
    product = await Product.findByIdAndUpdate(
      id,
      { name, description, price },
      { new: true }
    ).exec();
    if (!product) {
      throw new Error("Product Not Found!");
    }
    res.status(200).json({ product });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Error updating product" });
  }
};

//delete a product in the database
const deleteProduct = async (req, res) => {
  const id = req.params.id;
  let product;
  try {
    product = await Product.findByIdAndDelete(id);
    if (!product) {
      throw new Error("Product Not Found");
    }
    res.status(200).json({ product });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Error deleting product" });
  }
};




module.exports = {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
};
