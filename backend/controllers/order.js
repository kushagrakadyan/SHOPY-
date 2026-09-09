const Order = require('../models/order');
const Product = require('../models/product');
const Snowflake = require('@theinternetfolks/snowflake');
const { notifyWishlistProductChange } = require('../services/wishlistAlertService');

const createId = () => Snowflake.Snowflake.generate();

exports.newOrder = async (req, res) => {
    try {
        const {
            shippingInfo,
            orderItems,
            paymentInfo,
            itemsPrice,
            shippingPrice,
            totalPrice,
            couponUsed,
            couponCode,
            discountedAmount
        } = req.body;

        const order = await Order.create({
            _id: createId(),
            shippingInfo,
            orderItems,
            paymentInfo,
            itemsPrice,
            shippingPrice,
            totalPrice,
            couponUsed,
            couponCode,
            discountedAmount,
            paidAt: Date.now(),
            user: req.user._id
        });

        res.status(201).json({ success: true, order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getSingleOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name email');

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        res.status(200).json({ success: true, order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.myOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id });
        res.status(200).json({ success: true, orders });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find();
        const totalAmount = orders.reduce((total, order) => total + Number(order.totalPrice || 0), 0);
        res.status(200).json({ success: true, orders, totalAmount });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        if (order.orderStatus === 'Delivered') {
            return res.status(400).json({ success: false, message: 'You have already delivered this order' });
        }

        if (req.body.status === 'Shipped') {
            for (const item of order.orderItems) {
                await updateStock(item.product, item.quantity, req.app);
            }
        }

        order.orderStatus = req.body.status;

        if (req.body.status === 'Delivered') {
            order.DeliveredAt = Date.now();
        }

        await order.save({ validateBeforeSave: false });

        const socketio = req.app.get('socketio');
        if (socketio) {
            socketio.to(`user:${order.user}`).emit('orderStatusUpdated', {
                orderId: order._id,
                status: order.orderStatus,
                message: `Your order status is now ${order.orderStatus}.`
            });
        }

        res.status(200).json({ success: true, order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        await Order.findByIdAndDelete(req.params.id);

        res.status(200).json({ success: true, order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.reorder = async (req, res) => {
    try {
        const sourceOrder = await Order.findOne({ _id: req.body.orderId, user: req.user._id });

        if (!sourceOrder) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        res.status(200).json({ success: true, orderItems: sourceOrder.orderItems });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

async function updateStock(id, quantity, app) {
    const product = await Product.findById(id);
    if (!product) {
        return;
    }
    const oldStock = Number(product.Stock || 0);
    product.Stock = oldStock - Number(quantity || 0);
    await product.save({ validateBeforeSave: false });

    try {
        await notifyWishlistProductChange({
            app,
            productId: product._id,
            productName: product.name,
            oldPrice: product.price,
            newPrice: product.price,
            oldStock,
            newStock: product.Stock
        });
    } catch (alertError) {
        console.error('Wishlist stock alert error:', alertError.message);
    }
}
