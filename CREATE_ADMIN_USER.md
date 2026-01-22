# How to Create Admin User

## Step 1: Register an Account

1. Go to your website: `http://localhost:3000/login`
2. Click **"Register"** (or the "Don't have an account? Register" link)
3. Fill in:
   - Full Name
   - Email
   - Password (at least 6 characters)
4. Click **"Create Account"**

This will:
- Create your Firebase Authentication account
- Create a document in the `users` collection in Firestore
- Set your role to `"member"` by default

## Step 2: Make Yourself Admin

After registering, go to Firebase Console:

1. **Firebase Console** → https://console.firebase.google.com
2. Select your project: `modern-investor-c7c5a`
3. Go to **Firestore Database** → **Data** tab
4. You should now see a `users` collection
5. Click on the `users` collection
6. You'll see a document with your User UID (long string)
7. Click on that document
8. You'll see fields like:
   - `email`: your email
   - `role`: "member"
   - `createdAt`: timestamp
9. Click on the `role` field
10. Change the value from `"member"` to `"admin"`
11. Click **"Update"**

## Step 3: Verify Admin Access

1. Go back to your website
2. **Log out** (if you're logged in)
3. **Log back in** with your credentials
4. Try accessing `/admin/dashboard`
5. You should now have admin access!

## Alternative: Create User Document Manually

If registration didn't create the user document:

1. Go to **Firebase Console** → **Authentication** → **Users**
2. Find your email and copy the **User UID** (long string)
3. Go to **Firestore Database** → **Data**
4. Click **"Start collection"**
5. Collection ID: `users`
6. Click **"Next"**
7. Document ID: paste your User UID
8. Add fields:
   - Field: `email`, Type: string, Value: your email
   - Field: `role`, Type: string, Value: `admin`
   - Field: `createdAt`, Type: string, Value: current date (e.g., "2024-01-22T12:00:00.000Z")
9. Click **"Save"**

## Troubleshooting

**If you don't see the users collection after registering:**
- Check browser console for errors
- Check Firebase Console → Firestore → Data to see if collection was created
- Try registering again
- Check Firestore security rules are published

**If you can't access admin dashboard:**
- Make sure you logged out and back in after changing role
- Check the `role` field is exactly `"admin"` (lowercase, no quotes in the value)
- Check browser console for any errors
