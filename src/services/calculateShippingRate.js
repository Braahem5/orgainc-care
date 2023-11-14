const Shipping = require("../models/Shipping");
const logger = require("../utils/logger/logger");

/**
 * Calculate the shipping rate based on the shipping method, region, and international status.
 * @param {string} shippingMethod - The selected shipping method.
 * @param {string} region - The shipping destination region.
 * @param {boolean} isInternational - Indicates if the shipping is international.
 * @returns {Promise<number>} The calculated shipping rate.
 * @throws {Error} If any errors occur during the calculation.
 */

async function calculateShippingRate(shippingMethod, region, isInternational) {
  try {
    // Input validation
    if (
      typeof shippingMethod !== "string" ||
      typeof region !== "string" ||
      typeof isInternational !== "boolean"
    ) {
      throw new Error(
        "Invalid input. Ensure that shippingMethod is a string, region is a string, and isInternational is a boolean."
      );
    }

    // Retrieve the shipping option from your database based on shippingMethod
    const shippingOption = await Shipping.findOne({
      userId: req.query.user_Id,
      shippingMethod: shippingMethod,
    }).exec();

    if (!shippingOption) {
      // Handle the case where the specified shipping method doesn't exist
      throw new Error("Shipping method not found");
    }

    // Determine which rate array to use based on whether the order is international
    const rates = isInternational
      ? shippingOption.internationalRates
      : shippingOption.domesticRates;

    const rate = rates.find((rate) => rate.region === region);
    if (!rate) {
      throw new Error(
        `Region not found for the given shipping method: ${region}`
      );
    }
    return rate.rate;
  } catch (error) {
    logger.error(`Error in calculateShippingRate: ${error.message}`);
    console.log("Error in calculating the rate", err);
    throw new Error("Error in calculating shipping rate");
  }
}

module.exports = calculateShippingRate;
