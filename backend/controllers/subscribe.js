const Subscriber = require('../models/subscribe');
const Snowflake = require('@theinternetfolks/snowflake');

exports.subscriber = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ success: false, message: 'Email is required' });
        }

        const existingSubscriber = await Subscriber.findOne({ email });
        if (existingSubscriber) {
            return res.status(400).json({ success: false, message: 'You have already subscribed to our newsletter' });
        }

        const subscriber = await Subscriber.create({
            _id: Snowflake.Snowflake.generate(),
            email
        });

        res.status(201).json({ success: true, subscriber });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
