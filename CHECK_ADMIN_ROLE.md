# How to Check and Fix Admin Role

## Step 1: Check Your Current Role

1. Log in to the website
2. Go to `/dashboard`
3. You should see your role displayed: "Role: member" or "Role: admin"
4. Check the browser console (F12) for "User data loaded:" message
   - It will show what role Firestore has for you

## Step 2: Verify in Firestore

1. Go to **Firebase Console** → **Firestore Database** → **Data**
2. Open the `users` collection
3. Find your user document (by your User UID)
4. Check the `role` field:
   - Should be exactly `"admin"` (lowercase, with quotes in the value)
   - NOT `"Admin"` or `"ADMIN"` or `admin` (without quotes)

## Step 3: Fix the Role

If the role is not `"admin"`:

1. Click on your user document in Firestore
2. Find the `role` field
3. Click on it to edit
4. Change the value to exactly: `admin`
5. Make sure the type is **string**
6. Click **"Update"**

## Step 4: Refresh and Test

1. **Log out** of the website
2. **Log back in**
3. Check `/dashboard` - you should see "Role: admin"
4. You should see an "Admin" link in the navigation
5. Go to `/admin/dashboard` - you should have access

## Debugging

If it still doesn't work:

1. Open browser console (F12)
2. Look for "User data loaded:" message
3. Check what `role` value it shows
4. If it shows `undefined` or `null`, the Firestore document might not be loading
5. Check Firestore security rules allow reading user documents

## Quick Test

After setting role to admin:
- Refresh the page
- Check console for: `User data loaded: { role: "admin", ... }`
- If you see `role: "admin"`, you should have admin access
- If you see `role: "member"` or `undefined`, check Firestore again
