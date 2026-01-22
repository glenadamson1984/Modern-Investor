# How to Get Firebase Configuration Values

## Step-by-Step Guide

1. **Go to Firebase Console**
   - Visit: https://console.firebase.google.com
   - Select your `modern-investments` project

2. **Open Project Settings**
   - Click the **gear icon** (⚙️) next to "Project Overview" in the left sidebar
   - Select **"Project settings"**

3. **Scroll to "Your apps" section**
   - You'll see a section called **"Your apps"** near the bottom
   - If you haven't added a web app yet, click the **Web icon** (`</>`)
   - Register your app with nickname: `modern-investments-web`
   - Click **Register app**

4. **Copy the Configuration**
   - You'll see a code block that looks like this:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
     authDomain: "your-project-id.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project-id.appspot.com",
     messagingSenderId: "123456789012",
     appId: "1:123456789012:web:abcdef1234567890"
   };
   ```

5. **Map to Environment Variables**
   - `apiKey` → `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `authDomain` → `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `projectId` → `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `storageBucket` → `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` (can leave empty for now)
   - `messagingSenderId` → `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `appId` → `NEXT_PUBLIC_FIREBASE_APP_ID`

## Example .env.local File

Create a file named `.env.local` in the `modern-investments` folder root:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=modern-investments-12345.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=modern-investments-12345
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=modern-investments-12345.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Note:** Replace all the example values with your actual Firebase config values!

## Visual Guide

The config values are in the Firebase Console under:
**Project Settings** → **General** tab → Scroll down to **"Your apps"** → Click on your web app → You'll see the `firebaseConfig` object
