const Product = require('../models/product');
const User = require('../models/user');
const ApiFeatures = require('../utils/apifeatures');
const Snowflake = require('@theinternetfolks/snowflake');

const createId = () => Snowflake.Snowflake.generate();

const normalizeImages = (files = []) =>
    files.map((file) => ({
        _id: createId(),
        url: `data:${file.mimetype};base64,${file.buffer.toString('base64')}`
    }));

const recalculateReviews = (product) => {
    product.numOfReviews = product.reviews.length;
    product.ratings = product.reviews.length
        ? product.reviews.reduce((acc, review) => acc + Number(review.rating || 0), 0) / product.reviews.length
        : 0;
};

exports.getAllProducts = async (req, res) => {
    try {
        const resultPerPage = Number(process.env.RESULT_PER_PAGE) || 12;
        const productsCount = await Product.countDocuments();
        const filteredQuery = new ApiFeatures(Product.find(), req.query).search().filter().sort();
        const filteredProductsCount = await filteredQuery.query.clone().countDocuments();
        const parsedLimit = Number(req.query.limit);
        const limit = Number.isInteger(parsedLimit) && parsedLimit > 0
            ? Math.min(parsedLimit, 50)
            : resultPerPage;
        const parsedPage = Number(req.query.page);
        const currentPage = Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;
        const totalPages = Math.ceil(filteredProductsCount / limit);
        const products = await filteredQuery.pagination(resultPerPage).query;
        const categories = await Product.distinct('category');

        res.status(200).json({
            success: true,
            products,
            productsCount,
            resultPerPage,
            filteredProductsCount,
            currentPage,
            totalPages,
            facets: {
                categories: {
                    buckets: categories.map((category) => ({ key: category }))
                }
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getAdminProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json({ success: true, products });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getProductDetails = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        res.status(200).json({ success: true, product });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const update = { ...req.body };

        if (req.files && req.files.length) {
            update.images = normalizeImages(req.files);
        }

        const product = await Product.findByIdAndUpdate(req.params.id, update, {
            new: true,
            runValidators: true,
            useFindAndModify: false
        });

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        res.status(200).json({ success: true, product });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.createProductReview = async (req, res) => {
    try {
        const reviewBody = req.body.reviewData || req.body;
        const { rating, comment, productId } = reviewBody;
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        const review = {
            _id: createId(),
            user: req.user._id,
            name: req.user.name,
            rating: Number(rating),
            comment
        };

        const existingReviewIndex = product.reviews.findIndex(
            (item) => String(item.user) === String(req.user._id)
        );

        if (existingReviewIndex >= 0) {
            product.reviews[existingReviewIndex] = review;
        } else {
            product.reviews.push(review);
        }

        recalculateReviews(product);
        await product.save({ validateBeforeSave: false });

        res.status(200).json({ success: true, review });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getProductReviews = async (req, res) => {
    try {
        const product = await Product.findById(req.query.id);

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        res.status(200).json({ success: true, reviews: product.reviews });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteReview = async (req, res) => {
    try {
        const productId = req.body.productId || req.query.productId;
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        product.reviews = product.reviews.filter(
            (review) => String(review._id) !== String(req.params.reviewId)
        );

        recalculateReviews(product);
        await product.save({ validateBeforeSave: false });

        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.addToWishList = async (req, res) => {
    try {
        if (!req.params.id || typeof req.params.id !== 'string') {
            return res.status(400).json({ success: false, message: 'Product id is required' });
        }

        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const exists = user.wishlist.some((item) =>
            String(item.product || item._id) === String(product._id)
        );

        if (!exists) {
            user.wishlist.push(product.toObject());
            await user.save({ validateBeforeSave: false });
        }

        res.status(200).json({ success: true, wishlist: user.wishlist });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.removeFromWishList = async (req, res) => {
    try {
        if (!req.params.id || typeof req.params.id !== 'string') {
            return res.status(400).json({ success: false, message: 'Product id is required' });
        }

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        user.wishlist = user.wishlist.filter((item) =>
            String(item.product || item._id) !== String(req.params.id)
        );
        await user.save({ validateBeforeSave: false });

        res.status(200).json({ success: true, wishlist: user.wishlist });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getAllWishlistProducts = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const uniqueWishlist = [];
        const seenProducts = new Set();
        user.wishlist.forEach((item) => {
            const productId = String(item.product || item._id);
            if (!seenProducts.has(productId)) {
                seenProducts.add(productId);
                uniqueWishlist.push(item);
            }
        });

        res.status(200).json({ success: true, wishlistProducts: uniqueWishlist });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.summerizeProductReviews = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        if (!product.reviews.length) {
            product.aiSummary = 'No reviews are available for this product yet.';
        } else {
            const average = product.ratings ? product.ratings.toFixed(1) : '0.0';
            product.aiSummary = `${product.numOfReviews} review(s), average rating ${average}. Recent feedback: ${product.reviews
                .slice(-5)
                .map((review) => review.comment)
                .join(' ')}`;
        }

        await product.save({ validateBeforeSave: false });

        res.status(200).json({ success: product.aiSummary, aiSummary: product.aiSummary });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.searchProducts = exports.getAllProducts;

exports.getAutocompleteSuggestions = async (req, res) => {
    try {
        const keyword = req.query.keyword || req.query.q || '';
        const products = await Product.find({ name: { $regex: keyword, $options: 'i' } })
            .limit(10)
            .select('name');

        res.status(200).json({ success: true, suggestions: products.map((product) => product.name) });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
