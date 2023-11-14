const calculateShippingRate = require("../services/calculateShippingRate");

const shippingRate = async (req,res) => {
    const {shippingMethod, region, isInternational } = req.query;
    try {
        const rate = await calculateShippingRate(shippingMethod, region, isInternational);
        res.json({ rate });
    }
    catch (error){
        res.status(500).json({ error: error.message })
    }
}

module.exports = shippingRate;