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
   - Fill in the environment variables
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

## Default Admin Credentials

- Email: `admin@platform.com`
- Password: `Admin@123`

## URLs

- API base URL: `http://localhost:5000/api`
- Frontend URL: `http://localhost:4200`

## Deployment Notes

- Frontend deployment target: Vercel
- Backend deployment target: Render
- Database deployment target: MongoDB Atlas

## Environment Variables

Backend `.env` values:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/golf_charity_db
JWT_ACCESS_SECRET=your_access_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here
NODE_ENV=development
CLIENT_URL=http://localhost:4200
```

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
