const dotenv = require('dotenv');
const path = require('path');

// config
dotenv.config({ path: path.resolve(__dirname, 'config/config.env') });

const app = require('./app');
// const cronJob = require('./cronJob');
const connectDB = require('./config/database');
const http = require('http');
const { Server } = require('socket.io');
const redisClient = require('./config/redisClient');
const jwt = require('jsonwebtoken');
const User = require('./models/user');

// Handling Uncaught Exceptions
// process.on('uncaughtException', (err) => {
//     console.log(`Error: ${err}`);
//     console.log(`Shutting down the server due to Uncaught Exceptions`);
//     process.exit(1);
// })

const createServer = http.createServer(app);
const io = new Server(createServer, {
    cors: {
        origin: (process.env.FRONTEND_URL || "http://localhost:3000")
            .split(',')
            .map((origin) => origin.trim())
            .filter(Boolean),
        credentials: true,
    }
});

io.use(async (socket, next) => {
    const cookieHeader = socket.handshake.headers.cookie || '';
    const token = cookieHeader
        .split(';')
        .map((cookie) => cookie.trim())
        .find((cookie) => cookie.startsWith('token='))
        ?.slice('token='.length);

    if (!token) return next();

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user = await User.findById(decoded.id).select('_id');
        if (user) socket.user = user;
    } catch (error) {
        socket.user = null;
    }

    next();
});

io.on('connection', (socket) => {
    if (socket.user?._id) {
        socket.join(`user:${socket.user._id}`);
    }

    socket.on('joinProductRoom', (productId) => {
        if (typeof productId === 'string' && productId.trim()) {
            socket.join(`product:${productId}`);
        }
    });

    socket.on('leaveProductRoom', (productId) => {
        if (typeof productId === 'string' && productId.trim()) {
            socket.leave(`product:${productId}`);
        }
    });
});

app.set('socketio', io);
app.set('redisClient', redisClient);

//connecting to database
connectDB();

const server = createServer.listen(process.env.PORT || 8080, () => {
    console.log(`✅ Server is working on http://localhost:${process.env.PORT || 8080}`)
})

// cronJob.start();

// Unhandeled Promise Rejection
// process.on("unhandledRejection", err => {
//     console.log(`Error: ${err.message}`);
//     console.log(`Shutting down the server due to Unhandled Promise Rejection`);
//     server.close(() => {
//         process.exit(1);
//     });
// });
