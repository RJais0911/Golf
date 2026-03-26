# Golf Charity Subscription Platform

A full-stack golf subscription platform where users pay a monthly fee, submit up to five golf scores, participate in scheduled number draws, and direct a configurable percentage of subscription fees and winnings to selected charities.

## Tech Stack

- Frontend: Angular, NgRx, SCSS
- Backend: Node.js, Express.js, MongoDB, Mongoose
- Auth: JWT access tokens with httpOnly refresh token cookies
- Security: helmet, cors, express-rate-limit, express-mongo-sanitize

## Local Setup

1. Clone the repository.
2. Backend setup:
   - `cd backend`
   - `npm install`
   - Copy `.env.example` to `.env`
   - Fill in the environment variables with your MongoDB Atlas URI and app secrets
3. Seed the database:
   - `cd backend`
   - `npm run seed`
4. Start the backend:
   - `cd backend`
   - `npm run dev`
5. Start the frontend:
   - `cd frontend`
   - `npm install`
   - `ng serve`

## Default Demo Credentials

- Admin: `admin@test.com / 123456`
- User: `user@test.com / 123456`

## URLs

- API base URL: `http://localhost:5001/api`
- Frontend URL: `http://localhost:4200`

## Deployment Notes

- Frontend deployment target: Vercel
- Backend deployment target: Render
- Database deployment target: MongoDB Atlas
- Backend start command on Render: `npm start`
- Backend build command on Render: `npm run build`

## Environment Variables

Backend `.env` values:

```env
PORT=5001
MONGODB_URI=mongodb+srv://your_db_user:your_db_password@cluster0.example.mongodb.net/golf_charity_db?retryWrites=true&w=majority&appName=Cluster0
JWT_ACCESS_SECRET=your_access_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here
NODE_ENV=development
CLIENT_URL=http://localhost:4200
```

For production deployment on Render, use values like:

```env
MONGODB_URI=mongodb+srv://your-atlas-connection-string
JWT_ACCESS_SECRET=your_strong_access_secret
JWT_REFRESH_SECRET=your_strong_refresh_secret
NODE_ENV=production
CLIENT_URL=https://your-angular-app.vercel.app
```

Notes:

- Render provides `PORT` automatically, so you do not need to set it manually there.
- `CLIENT_URL` can be a comma-separated list if you want to allow both local and deployed frontends, for example:
  `http://localhost:4200,https://your-angular-app.vercel.app`
- Do not commit `.env` to GitHub.
- In production, the refresh-token cookie is configured for cross-site frontend/backend deployment with `secure: true` and `sameSite: none`.
- In MongoDB Atlas, make sure `Network Access` allows your local IP for development and `0.0.0.0/0` if Render needs public access.

## Seed Data

The backend seed script creates:

- 1 admin user
- 3 charities
- 2 regular users

Run it with:

```bash
cd backend
npm run seed
```

## Assessment Payment Note

The subscription flow uses an in-app mock payment activation for assessment/demo stability. It does not rely on Stripe checkout, webhooks, or external payment redirects.
