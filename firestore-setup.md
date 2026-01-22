# Firestore Security Rules Setup

## Quick Setup

1. Go to Firebase Console: https://console.firebase.google.com
2. Select your project
3. Navigate to **Firestore Database** → **Rules** tab
4. Copy the contents of `firestore.rules` file
5. Paste into the rules editor
6. Click **Publish**

## Rules Overview

- **Users**: Users can read their own data, admins can read all
- **Performance**: Public read access, admin write only
- **Trades**: Members can read, admin write only
- **Courses**: Members can read, admin write only
- **Bookings**: Users can read their own bookings, admin can manage all
- **Articles**: Public read access, admin write only
- **Predictions**: Members can read, admin write only

## Creating an Admin User

To create an admin user:

1. Register a user through the app (or create one in Firebase Console)
2. Go to Firestore Database → Data tab
3. Find the user document in the `users` collection
4. Edit the document and add/update the `role` field to `"admin"`

## Testing Rules

You can test rules in the Firebase Console:
- Go to Firestore Database → Rules tab
- Click "Rules Playground" to test different scenarios
