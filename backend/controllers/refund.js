const Refund = require('../models/refund');
const Order = require('../models/order');
const Snowflake = require('@theinternetfolks/snowflake');

exports.initiateRefund = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        const refund = await Refund.create({
            _id: Snowflake.Snowflake.generate(),
            order: order._id,
            amount: order.totalPrice,
            status: 'Requested'
        });

        order.isRefunded = false;
        order.refundRequestedAt = Date.now();
        order.refundStatus = 'Requested';
        order.refund.push(refund._id);
        await order.save({ validateBeforeSave: false });

        res.status(201).json({ success: true, order, refund });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateRefundStatus = async (req, res) => {
    try {
        const refund = await Refund.findById(req.params.refundId);
        const order = await Order.findById(req.params.orderId);

        if (!refund || !order) {
            return res.status(404).json({ success: false, message: 'Refund or order not found' });
        }

        refund.status = req.body.refundStatus;
        await refund.save({ validateBeforeSave: false });

        order.refundStatus = req.body.refundStatus;
        order.isRefunded = req.body.refundStatus === 'Completed';
        if (order.isRefunded) {
            order.refundedAt = Date.now();
            refund.completedAt = Date.now();
        }
        await order.save({ validateBeforeSave: false });

        res.status(200).json({ success: true, order, refund });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getAllRefunds = async (req, res) => {
    try {
        const refunds = await Refund.find();
        res.status(200).json({ success: true, refunds });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
