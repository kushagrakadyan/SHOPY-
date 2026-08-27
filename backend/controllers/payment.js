const getStripe = () => require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.processPayment = async (req, res) => {
    try {
        if (!process.env.STRIPE_SECRET_KEY) {
            return res.status(500).json({ success: false, message: 'Stripe secret key is not configured' });
        }

        const amount = Math.round(Number(req.body.amount || 0));
        if (!amount) {
            return res.status(400).json({ success: false, message: 'Payment amount is required' });
        }

        const paymentIntent = await getStripe().paymentIntents.create({
            amount,
            currency: 'inr',
            metadata: { company: 'Ecommerce' }
        });

        res.status(200).json({
            success: true,
            client_secret: paymentIntent.client_secret
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.sendStripeApiKey = async (req, res) => {
    res.status(200).json({ stripeApiKey: process.env.STRIPE_PUBLISHABLE_KEY || '' });
};
