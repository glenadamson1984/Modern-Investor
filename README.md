# Modern Investments Network

Investment network platform for Northern Ireland built with Next.js.

## Features

- Live performance tracking
- Member authentication
- Coaching portal with courses and 1-on-1 sessions
- Live trade updates
- Prediction models
- Educational articles
- Admin panel for data management

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables in `.env.local`:
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Firebase Collections

- `users` - Member profiles
- `performance` - Performance metrics
- `trades` - Trade records
- `courses` - Coaching courses
- `bookings` - Coaching appointments
- `articles` - Educational content
- `predictions` - Prediction model outputs

## Admin Access

To create an admin user, set the `role` field to `"admin"` in the user document in Firestore.
