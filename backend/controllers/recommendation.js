const { getLimit, getRecommendations } = require('../services/recommendationService');

exports.getRecommendations = async (req, res) => {
    try {
        const { productId } = req.query;
        if (productId !== undefined && (typeof productId !== 'string' || !productId.trim())) {
            return res.status(400).json({ success: false, message: 'Invalid product id' });
        }

        const result = await getRecommendations({
            productId: productId?.trim(),
            user: req.user,
            limit: getLimit(req.query.limit)
        });

        res.status(200).json({
            success: true,
            recommendations: result.recommendations,
            source: result.source
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};