# Troubleshooting Login Issues

## Common Issues and Solutions

### 1. "Missing or insufficient permissions" Error

**Solution:** Make sure you've set up Firestore security rules:
1. Go to Firebase Console → Firestore Database → Rules
2. Copy contents from `firestore.rules` file
3. Paste and click "Publish"

### 2. Email/Password Authentication Not Enabled

**Solution:** Enable Email/Password authentication:
1. Go to Firebase Console → Authentication
2. Click "Get started" if you haven't already
3. Go to "Sign-in method" tab
4. Click on "Email/Password"
5. Toggle "Enable" to ON
6. Click "Save"

### 3. Login Button Not Working

**Check:**
- Browser console for errors (F12 → Console tab)
- Network tab to see if requests are being made
- Firebase Console → Authentication → Users to see if user was created

### 4. User Created but Can't Access Dashboard

**Solution:** 
- Check Firestore → `users` collection
- Make sure user document exists with `role: "member"` or `role: "admin"`
- If missing, manually create the document with:
  ```json
  {
    "email": "user@example.com",
    "role": "member",
    "createdAt": "2024-01-22T..."
  }
  ```

### 5. Firebase Config Not Loading

**Check:**
- `.env.local` file exists in project root
- All environment variables are set correctly
- Restart dev server after creating `.env.local`
- Check browser console for Firebase initialization errors

### 6. Testing Login

1. Try registering a new account first
2. Check Firebase Console → Authentication → Users to confirm user was created
3. Check Firestore → `users` collection to see user document
4. Try logging in with the credentials

### Debug Steps

1. Open browser console (F12)
2. Try to login/register
3. Check for any error messages
4. Check Network tab for failed requests
5. Verify Firebase config is loaded (check console for Firebase errors)
