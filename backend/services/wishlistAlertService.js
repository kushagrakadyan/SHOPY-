const User = require('../models/user');

const notifyWishlistProductChange = async ({ app, productId, productName, oldPrice, newPrice, oldStock, newStock }) => {
    const priceDropped = Number(newPrice) < Number(oldPrice);
    const backInStock = Number(oldStock) <= 0 && Number(newStock) > 0;

    if (!priceDropped && !backInStock) return;

    const socketio = app && app.get('socketio');
    if (!socketio) return;

    const users = await User.find({
        $or: [
            { 'wishlist._id': String(productId) },
            { 'wishlist.product': String(productId) }
        ]
    }).select('_id').lean();

    const timestamp = new Date().toISOString();
    const alerts = [];

    if (priceDropped) {
        alerts.push({
            type: 'PRICE_DROP',
            productId: String(productId),
            productName,
            oldPrice: Number(oldPrice),
            newPrice: Number(newPrice),
            message: `Price dropped on ${productName}: ${oldPrice} -> ${newPrice}.`,
            timestamp
        });
    }

    if (backInStock) {
        alerts.push({
            type: 'BACK_IN_STOCK',
            productId: String(productId),
            productName,
            stock: Number(newStock),
            message: `${productName} is back in stock.`,
            timestamp
        });
    }

    users.forEach((user) => {
        alerts.forEach((alert) => {
            socketio.to(`user:${user._id}`).emit('wishlistAlert', alert);
        });
    });
};

module.exports = { notifyWishlistProductChange };