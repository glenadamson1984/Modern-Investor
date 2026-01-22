# Firebase Setup for Modern Investments

## Step 1: Create New Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click **"Add project"** or **"Create a project"**
3. Enter project name: `modern-investments` (or your preferred name)
4. Click **Continue**
5. **Disable** Google Analytics (optional, or enable if you want it)
6. Click **Create project**
7. Wait for project to be created, then click **Continue**

## Step 2: Enable Authentication

1. In Firebase Console, go to **Authentication** → **Get started**
2. Click **Sign-in method** tab
3. Enable **Email/Password**:
   - Click on "Email/Password"
   - Toggle **Enable**
   - Click **Save**

## Step 3: Create Firestore Database

1. Go to **Firestore Database** → **Create database**
2. Choose **Start in test mode** (we'll add rules next)
3. Select a location (choose closest to Northern Ireland, e.g., `europe-west`)
4. Click **Enable**

## Step 4: Set Up Security Rules

1. Go to **Firestore Database** → **Rules** tab
2. Copy the contents from `firestore.rules` file in this project
3. Paste into the rules editor
4. Click **Publish**

## Step 5: Enable Storage (for file uploads)

1. Go to **Storage** → **Get started**
2. Click **Next** through the setup
3. Choose **Start in test mode** (we'll add rules)
4. Select same location as Firestore
5. Click **Done**

### Storage Rules (optional, for production)

Go to **Storage** → **Rules** and use:
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /uploads/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## Step 6: Get Firebase Configuration

1. Go to **Project Settings** (gear icon) → **General** tab
2. Scroll down to **Your apps** section
3. Click **Web** icon (`</>`)
4. Register app with nickname: `modern-investments-web`
5. Copy the Firebase configuration object

## Step 7: Add Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Replace all values with the ones from your Firebase config.

## Step 8: Create Initial Collections

After setting up, you can create these collections in Firestore (they'll be created automatically when data is added, but you can pre-create them):

- `users` - User profiles
- `performance` - Performance metrics
- `trades` - Trade records
- `courses` - Coaching courses
- `bookings` - Coaching appointments
- `articles` - Educational articles
- `predictions` - Prediction model outputs

## Step 9: Create Admin User

1. Register a user through the app at `/login`
2. Go to **Firestore Database** → **Data** tab
3. Find the user document in `users` collection
4. Click on the document
5. Add a field: `role` with value `"admin"`
6. Save

## Testing

After setup, test by:
1. Running `npm run dev`
2. Going to `/login` and creating an account
3. Checking Firestore to see the user document created
4. Setting that user's role to "admin" to access admin features
