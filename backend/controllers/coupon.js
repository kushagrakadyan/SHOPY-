const Coupon = require('../models/coupon');
const Snowflake = require('@theinternetfolks/snowflake');

exports.generateCoupon = async (req, res) => {
    try {
        const { code, discount, expiresAt } = req.body;

        const coupon = await Coupon.create({
            _id: Snowflake.Snowflake.generate(),
            code,
            discount,
            expiresAt: expiresAt || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        });

        const coupons = await Coupon.find();
        res.status(201).json({ success: true, coupon, coupons });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getAllCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find();
        res.status(200).json({ success: true, coupons });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
