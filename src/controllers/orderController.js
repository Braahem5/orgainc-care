const Order = require("../models/Order");
const logger = require("../utils/logger/logger");

//Create order history
const createOrder = async (req, res) => {
  try {
    const {
      user,
      orderItems,
      shippingAddress,
      totalPrice,
      orderDate,
      paymentMethod,
    } = req.body;
    const order = new Order({
      user,
      orderItems,
      shippingAddress,
      totalPrice,
      orderDate,
      paymentMethod,
    });
    await order.save();
    if (!order) {
      throw Error("Failed to save the order");
    }
    logger.info("User order successfully created!");
    return res.status(201).json({ message: "Order created successfully" });
  } catch (error) {
    logger.error(`Failed to create user order due to ${error}`);
    console.log(error);
    return res.status(500).json({ message: `Server Error: ${error}` });
  }
};

// Get order history for all customer
const getOrders = async (req, res) => {
  try {
    const userId = req.query?.user_Id;
    const orders = await Order.find(userId)
      .populate({
        path: "product",
        model: "Product",
      })
      .exec();
    logger.info("List of all user's order is retrieved successfully");
    return res.status(200).json(orders);
  } catch (error) {
    logger.error(`Error in retrieving user order ${error}`);
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};

// Get order history for a specific customer
const getOrder = async (req, res) => {
  try {
    const userId = req.query?.user_Id;
    let id = req.params.orderId;
    const order = await Order.findOne({ userId: userId, orderItems: id })
      .sort("-createdAt")
      .populate({
        path: "product",
        model: "Product",
      })
      .exec();
    if (!order) {
      throw Error("No such order found");
    }
    logger.info("User order retrieved successfully");
    return res.status(200).json(order);
  } catch (err) {
    console.log(err);
    return res.status(404).send("Error in fetching the data");
  }
};

// Update the status of an order
const updateStatus = async (req, res) => {
  try {
    const userId = req.query?.user_Id;
    let id = req.params.orderId;
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      { userId: userId, orderItems: id },
      { status },
      { new: true }
    ).exec();

    if (!order) {
      throw Error("No such order found");
    }
    logger.info("Order status updated successfully");
    return res.status(200).json(order);
  } catch (e) {
    logger.error(`Error updating user's order status ${e}`);
    console.log(e);
    return res.status(404).send("Error updating the order status");
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrder,
  updateStatus,
};
