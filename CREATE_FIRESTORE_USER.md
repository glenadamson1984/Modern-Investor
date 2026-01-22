# Create Firestore User Document for Existing Auth User

Since you created the user in Firebase Authentication but not in Firestore, here's how to create the Firestore document:

## Step 1: Get Your User UID

1. Go to **Firebase Console** → **Authentication** → **Users**
2. Find your email address
3. Click on it to see details
4. Copy the **User UID** (the long string, e.g., `abc123def456...`)

## Step 2: Create User Document in Firestore

1. Go to **Firebase Console** → **Firestore Database** → **Data** tab
2. Click **"Start collection"** (if `users` collection doesn't exist)
3. Collection ID: `users`
4. Click **"Next"**
5. Document ID: **Paste your User UID** (the one you copied in Step 1)
6. Add these fields:

   **Field 1:**
   - Field name: `email`
   - Type: **string**
   - Value: your email address

   **Field 2:**
   - Field name: `role`
   - Type: **string**
   - Value: `admin` (or `member` if you want regular access)

   **Field 3:**
   - Field name: `createdAt`
   - Type: **string**
   - Value: current date (e.g., `2024-01-22T12:00:00.000Z`)

7. Click **"Save"**

## Step 3: Test Login

1. Go back to your website
2. Try logging in with your email and password
3. You should now be able to access the dashboard
4. If you set `role: "admin"`, you can access `/admin/dashboard`

## Alternative: Use Login Instead

Since the user already exists in Authentication:
1. Go to `/login`
2. Click **"Login"** (not Register)
3. Enter your email and password
4. You should be able to log in
5. Then create the Firestore document as above

## Quick Reference

Your Firestore document should look like:
```
Collection: users
Document ID: [your-user-uid]
Fields:
  - email: "your@email.com"
  - role: "admin"
  - createdAt: "2024-01-22T12:00:00.000Z"
```
