const crypto = require('crypto');
const { OAuth2Client } = require('google-auth-library');
const Snowflake = require('@theinternetfolks/snowflake');
const User = require('../models/user');
const sendToken = require('../utils/jwtToken');
const sendEmail = require('../utils/sendEmail');

const createId = () => Snowflake.Snowflake.generate();

const avatarUrlFromFile = (file, fallbackAvatar) => {
    if (fallbackAvatar) {
        return fallbackAvatar;
    }

    if (!file) {
        return 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg';
    }

    return `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
};

exports.registerUser = async (req, res) => {
    try {
        const { name, email, password, whatsappNumber } = req.body;

        const user = await User.create({
            _id: createId(),
            name,
            email,
            password,
            whatsappNumber,
            avatar: avatarUrlFromFile(req.file, req.body.avatar)
        });

        sendToken(user, 201, res);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Please enter email and password' });
        }

        const user = await User.findOne({ email }).select('+password');

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        sendToken(user, 200, res);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.logout = async (req, res) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    });

    res.status(200).json({ success: true, message: 'Logged out' });
};

exports.forgotPassword = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const resetToken = user.getResetPasswordToken();
        await user.save({ validateBeforeSave: false });

        const resetUrl = `${process.env.FRONTEND_URL || `${req.protocol}://${req.get('host')}`}/password/reset/${resetToken}`;
        const html = `<p>Your password reset link is:</p><p><a href="${resetUrl}">${resetUrl}</a></p>`;

        try {
            await sendEmail({
                email: user.email,
                subject: 'Password Recovery',
                html
            });

            res.status(200).json({ success: true, message: `Email sent to ${user.email}` });
        } catch (emailError) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save({ validateBeforeSave: false });

            res.status(500).json({ success: false, message: emailError.message });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(req.params.token)
            .digest('hex');

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ success: false, message: 'Reset password token is invalid or expired' });
        }

        if (req.body.password !== req.body.confirmPassword) {
            return res.status(400).json({ success: false, message: 'Password does not match' });
        }

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        sendToken(user, 200, res);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getUserDetails = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updatePassword = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('+password');

        const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
        if (!isPasswordMatched) {
            return res.status(400).json({ success: false, message: 'Old password is incorrect' });
        }

        if (req.body.newPassword !== req.body.confirmPassword) {
            return res.status(400).json({ success: false, message: 'Password does not match' });
        }

        user.password = req.body.newPassword;
        await user.save();

        sendToken(user, 200, res);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({ success: true, users });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getSingleUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ success: false, message: `User does not exist with id: ${req.params.id}` });
        }

        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateUserRole = async (req, res) => {
    try {
        const newUserData = {
            name: req.body.name,
            email: req.body.email,
            role: req.body.role
        };

        const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
            new: true,
            runValidators: true,
            useFindAndModify: false
        });

        if (!user) {
            return res.status(404).json({ success: false, message: `User does not exist with id: ${req.params.id}` });
        }

        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.googleLogin = async (req, res) => {
    try {
        const { idToken } = req.body;

        if (!idToken) {
            return res.status(400).json({ success: false, message: 'Google token is required' });
        }

        const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || process.env.GOOGLE_OAUTH_CLIENT_ID);
        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID || process.env.GOOGLE_OAUTH_CLIENT_ID
        });
        const payload = ticket.getPayload();

        let user = await User.findOne({ email: payload.email });

        if (!user) {
            user = await User.create({
                _id: createId(),
                name: payload.name,
                email: payload.email,
                avatar: payload.picture || avatarUrlFromFile(),
                authProvider: 'google'
            });
        }

        sendToken(user, 200, res);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.sendLoginOtp = async (req, res) => {
    res.status(501).json({ success: false, message: 'OTP login is not configured in this project' });
};

exports.verifyLoginOtp = async (req, res) => {
    res.status(501).json({ success: false, message: 'OTP login is not configured in this project' });
};

exports.setupTwoFactorAuth = async (req, res) => {
    res.status(501).json({ success: false, message: 'Two-factor setup is not configured in this project' });
};

exports.verifyTwoFactorAuth = async (req, res) => {
    res.status(501).json({ success: false, message: 'Two-factor verification is not configured in this project' });
};

exports.disableTwoFactorAuth = async (req, res) => {
    res.status(501).json({ success: false, message: 'Two-factor disable is not configured in this project' });
};

exports.validateTfaToken = async (req, res) => {
    res.status(501).json({ success: false, message: 'Two-factor validation is not configured in this project' });
};
