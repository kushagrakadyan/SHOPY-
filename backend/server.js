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
