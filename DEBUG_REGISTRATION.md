# Debug Registration Issues

## Check These Things:

### 1. Open Browser Console
- Press **F12** or **Right-click → Inspect**
- Go to **Console** tab
- Try registering again
- Look for any **red error messages**

### 2. Check Network Tab
- In browser DevTools, go to **Network** tab
- Try registering
- Look for failed requests (red)
- Check if Firebase requests are being made

### 3. Check Firebase Console
- Go to **Firebase Console** → **Authentication** → **Users**
- See if your user was created there
- If yes, the registration worked but Firestore might have failed

### 4. Check Firestore
- Go to **Firestore Database** → **Data**
- Check if `users` collection exists
- Check if your user document was created

### 5. Common Issues

**Issue: Button doesn't do anything**
- Check console for JavaScript errors
- Make sure form validation isn't blocking submission
- Try clicking the button directly (not the styled wrapper)

**Issue: Toast notification appears but nothing else**
- Check if redirect is happening
- Check browser console for navigation errors
- Try manually going to `/dashboard` after registration

**Issue: "Missing or insufficient permissions"**
- Go to Firestore → Rules
- Make sure rules are published
- Check that rules allow creating user documents

**Issue: User created in Auth but not in Firestore**
- This means registration partially worked
- Check Firestore rules allow writes
- Check console for Firestore errors
- You can manually create the user document

## Quick Test

1. Open browser console (F12)
2. Try registering with:
   - Name: Test User
   - Email: test@example.com
   - Password: test123
3. Watch the console for:
   - "Registration successful" message
   - Any error messages
   - Network requests to Firebase

## Manual User Creation (If Registration Fails)

If registration creates the Auth user but not the Firestore document:

1. Go to **Firebase Console** → **Authentication** → **Users**
2. Find your user and copy the **UID**
3. Go to **Firestore Database** → **Data**
4. Create collection `users` if it doesn't exist
5. Add document with your UID as document ID
6. Add fields:
   - `email`: your email
   - `role`: "member" (or "admin" if you want admin access)
   - `createdAt`: current timestamp
