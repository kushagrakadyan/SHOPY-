const Return = require('../models/return');
const Order = require('../models/order');
const Snowflake = require('@theinternetfolks/snowflake');

exports.requestReturn = async (req, res) => {
    try {
        const order = await Order.findOne({ _id: req.params.id, user: req.user._id });

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        const returnRequest = await Return.create({
            _id: Snowflake.Snowflake.generate(),
            order: order._id,
            products: order.orderItems.map((item) => ({
                _id: Snowflake.Snowflake.generate(),
                product: item.product,
                quantity: item.quantity
            })),
            reason: req.body.returnReason,
            status: 'Pending'
        });

        order.isReturned = true;
        order.returnRequestedAt = Date.now();
        order.return.push(returnRequest._id);
        await order.save({ validateBeforeSave: false });

        res.status(201).json({ success: true, order, return: returnRequest });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getAllReturns = async (req, res) => {
    try {
        const returns = await Return.find();
        res.status(200).json({ success: true, returns });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
