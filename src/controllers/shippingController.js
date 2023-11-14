const Shipping = require("../models/Shipping");
const logger = require("../utils/logger/logger");

const createUserShippingOption = async (req, res) => {
  try {
    const { userId, order, shippingMethod, domesticRate, internationalRate } =
      req.body;
    const shipping_option = new Shipping({
      userId,
      order,
      shippingMethod,
      domesticRate,
      internationalRate,
    });
    await shipping_option.save();
    if (!shipping_option) {
      throw Error("Failed to save user's shipping option.");
    }
    logger.info("User shipping option created successfully");
    res.status(201).json(shipping_option);
  } catch (err) {
    console.error(err);
    logger.info(`unable to create user's shipping option ${err}`);
    return res.status(500).json({ message: "internal server error!" });
  }
};

const getUserShppingOption = async (req, res) => {
  const shippingId = req.query?.user_Id;
  try {
    const userShippingOptions = await Shipping.find({
      userId: shippingId,
    }).exec();
    if (!userShippingOptions) {
      throw new Error("No User Shipping Option found!");
    }
    logger.info(`Fetched the user's shipping options with id ${shippingId}`);
    return res.status(200).json(userShippingOptions);
  } catch (error) {
    logger.error("Error retrieving user's shipping option");
    console.error(error);
    return res
      .status(404)
      .json({ message: `Error retriveing user's shipping option ${error}` });
  }
};

const updateUserShppingOption = async (req, res) => {
  const { userId, order, shippingMethod, domesticRate, internationalRate } =
    req.body;
  const shippingId = req.query?.shippingId;
  try {
    const updatedShippingOption = await Shipping.findOneAndUpdate(
      { userId: shippingId },
      { userId, order, shippingMethod, domesticRate, internationalRate },
      { new: true }
    ).exec();
    if (!updateUserShppingOption) {
      throw new Error("User's shipping option not updated");
    }
    logger.info(`Updated user's shipping option with id ${shippingId}`);
    return res.status(200).json({
      massage: `successfully updated the shipping option ${updatedShippingOption}`,
    });
  } catch (error) {
    logger.error(`Error updating user's shipping option ${error}`);
    console.error(error);
    return res
      .status(400)
      .json({ message: `Error updating user's shipping option ` });
  }
};

const deleteUserShppingOption = async (req, res) => {
  const shippingId = req.query?.shippingId;
  try {
    const deletedShippingOption = await Shipping.findOneAndDelete({
      userId: shippingId,
    }).exec();
    if (!deletedShippingOption) {
      throw new Error("Couldn't find a shipping option for this user");
    }
    logger.info(
      `Succesfully deleted user's shipping option ${deletedShippingOption}`
    );
    return res
      .status(200)
      .json({ message: "User's shipping option successfully deleted" });
  } catch (error) {
    logger.error(`Error deleting user's shipping option ${error}`);
    console.error(error);
    return res
      .status(404)
      .json({ message: `Error deleting users shipping option` });
  }
};

module.exports = {
  createUserShippingOption,
  getUserShppingOption,
  updateUserShppingOption,
  deleteUserShppingOption,
};
