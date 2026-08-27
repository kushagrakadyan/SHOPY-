# MERN E-Commerce Platform

This is a full-stack MERN e-commerce application with a React frontend, Express API, MongoDB/Mongoose models, JWT cookie authentication, Stripe payments, product reviews, wishlist, coupons, newsletter subscription, returns/refunds, and Socket.IO product-room support.

## Architecture

Production is designed to run as one Express service:

```text
Browser
  -> Express server
     -> React production build
     -> REST API under /api/v1
     -> Socket.IO
```

The React app can also be deployed separately. In that case set `REACT_APP_API_URL` and configure the backend `FRONTEND_URL` to the deployed frontend origin.

## Requirements

- Node.js 20 LTS is recommended
- MongoDB database
- Stripe account for payments
- SMTP credentials for password reset email
- Optional AWS S3, Redis/Upstash, Google OAuth, Twilio, Gemini API depending on enabled features

## Environment

Create `backend/config/config.env` from `backend/config/config.env.example`.

Important backend variables:

```env
PORT=8080
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
DB_URI=mongodb://127.0.0.1:27017/ecommerce
JWT_SECRET_KEY=replace_me
JWT_EXPIRES_IN=90d
COOKIE_EXPIRES=90
RESULT_PER_PAGE=12
STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
SMTP_HOST=
SMTP_PORT=
SMTP_MAIL=
SMTP_PASSWORD=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_BUCKET_NAME=
AWS_BUCKET_REGION=
GOOGLE_CLIENT_ID=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
GEMINI_API_KEY=
```

Create `frontend/.env` from `frontend/.env.example` only when the frontend is deployed separately or needs non-default local settings.

```env
REACT_APP_API_URL=
REACT_APP_SOCKET_URL=
REACT_APP_GOOGLE_CLIENT_ID=
```

When React is served by Express, leave `REACT_APP_API_URL` empty so API and Socket.IO calls use the same origin.

## Local Development

Avoid `&` in the project folder path on Windows because `npm.cmd` can misparse lifecycle paths. Rename the folder to something like `frontend-backend` before running npm scripts.

Install dependencies:

```bash
npm install
npm install --prefix frontend
```

Run frontend and backend together:

```bash
npm run dev
```

Or run them separately:

```bash
npm run server
npm run client
```

The backend defaults to `PORT=8080`. The frontend development server proxies API requests to `http://localhost:8080`.

## Production Build

```bash
npm run build
npm start
```

The build command creates `frontend/build`; the Express server serves that build after API routes are registered.

## Docker Deployment

Build and run the one-service production image:

```bash
docker build -t mern-ecommerce .
docker run --env-file backend/config/config.env -p 8080:8080 mern-ecommerce
```

For Render or another Docker host, set environment variables in the platform dashboard. Do not commit real secrets.

## Main API Routes

- `POST /api/v1/register`
- `POST /api/v1/login`
- `GET /api/v1/logout`
- `GET /api/v1/me`
- `PUT /api/v1/password/update`
- `POST /api/v1/password/forgot`
- `PUT /api/v1/password/reset/:token`
- `GET /api/v1/products`
- `GET /api/v1/product/:id`
- `POST /api/v1/review`
- `GET /api/v1/reviews?id=<productId>`
- `DELETE /api/v1/review/:reviewId`
- `POST /api/v1/products/:id/summarize-reviews`
- `POST /api/v1/order/new`
- `GET /api/v1/orders/me`
- `GET /api/v1/admin/orders`
- `POST /api/v1/payment`
- `GET /api/v1/stripeapikey`
- `POST /api/v1/coupon`
- `GET /api/v1/coupons/all`
- `POST /api/v1/subscribe`

Direct admin product upload routes are also present for existing frontend compatibility:

- `POST /admin/add-product`
- `PUT /admin/product/:id`
- `DELETE /admin/product/:id`

## Validation

Useful checks before deployment:

```bash
node --check backend/app.js
node --check backend/server.js
node --check backend/utils/jwtToken.js
npm run build
git diff --check
```

Then start the server:

```bash
npm start
```

Visit `http://localhost:8080/api/v1/health` to confirm the API is responding.
