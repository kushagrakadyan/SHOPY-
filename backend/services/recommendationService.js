const Order = require('../models/order');
const Product = require('../models/product');

const MAX_CANDIDATES = 200;
const DEFAULT_LIMIT = 8;

const normalize = (value, maximum) => {
    const numericValue = Number(value) || 0;
    return maximum > 0 ? Math.min(numericValue / maximum, 1) : 0;
};

const productIdOf = (item) => String(item?.product || item?._id || '');

const getLimit = (value) => {
    const parsedLimit = Number(value);
    return Number.isInteger(parsedLimit) && parsedLimit > 0
        ? Math.min(parsedLimit, 12)
        : DEFAULT_LIMIT;
};

const getCurrentProduct = async (productId) => {
    if (!productId || typeof productId !== 'string') return null;
    return Product.findById(productId).select('name price ratings numOfReviews category Stock');
};

const getUserSignals = async (user) => {
    if (!user) return { categories: new Set(), productIds: new Set() };

    const wishlist = user.wishlist || [];
    const orders = await Order.find({ user: user._id })
        .select('orderItems.product')
        .limit(100)
        .lean();
    const productIds = new Set(wishlist.map(productIdOf).filter(Boolean));
    const categories = new Set();

    orders.forEach((order) => {
        (order.orderItems || []).forEach((item) => {
            if (item.product) productIds.add(String(item.product));
        });
    });

    return { categories, productIds };
};

const getRecommendations = async ({ productId, user, limit }) => {
    const currentProduct = await getCurrentProduct(productId);
    if (productId && !currentProduct) {
        return { recommendations: [], source: 'none' };
    }

    const userSignals = await getUserSignals(user);
    const wishlistCategoryProducts = user
        ? await Product.find({ _id: { $in: Array.from(userSignals.productIds) } })
            .select('category')
            .lean()
        : [];

    wishlistCategoryProducts.forEach((product) => {
        if (product.category) userSignals.categories.add(product.category);
    });

    const query = { Stock: { $gt: 0 } };
    if (productId) query._id = { $ne: productId };

    const candidates = await Product.find(query)
        .select('name price ratings numOfReviews category Stock images createdAt')
        .sort({ ratings: -1, numOfReviews: -1, createdAt: -1 })
        .limit(MAX_CANDIDATES)
        .lean();

    const referencePrice = Number(currentProduct?.price || 0);
    const referenceCategory = currentProduct?.category;
    const maxReviews = candidates.reduce(
        (maximum, product) => Math.max(maximum, Number(product.numOfReviews) || 0),
        0
    );
    const maxPrice = candidates.reduce(
        (maximum, product) => Math.max(maximum, Number(product.price) || 0),
        referencePrice
    );

    const scored = candidates.map((product) => {
        const categoryMatch = referenceCategory && product.category === referenceCategory ? 0.4 : 0;
        const priceSimilarity = referencePrice
            ? 0.2 * Math.max(0, 1 - Math.abs(Number(product.price) - referencePrice) / referencePrice)
            : 0;
        const ratingScore = 0.15 * normalize(product.ratings, 5);
        const reviewScore = 0.1 * normalize(product.numOfReviews, maxReviews);
        const userCategoryBoost = userSignals.categories.has(product.category) ? 0.15 : 0;
        const userProductBoost = userSignals.productIds.has(String(product._id)) ? 0.1 : 0;

        return {
            product,
            score: categoryMatch + priceSimilarity + ratingScore + reviewScore + userCategoryBoost + userProductBoost,
            priceDistance: Math.abs(Number(product.price) - referencePrice),
            maxPrice
        };
    });

    scored.sort((left, right) =>
        right.score - left.score ||
        Number(right.product.ratings || 0) - Number(left.product.ratings || 0) ||
        Number(right.product.numOfReviews || 0) - Number(left.product.numOfReviews || 0) ||
        left.priceDistance - right.priceDistance ||
        String(left.product._id).localeCompare(String(right.product._id))
    );

    const recommendations = scored.slice(0, limit).map(({ product }) => product);
    const source = user ? (currentProduct ? 'personalized-similar' : 'personalized') : 'content-based';
    return { recommendations, source };
};

module.exports = { getRecommendations, getLimit };