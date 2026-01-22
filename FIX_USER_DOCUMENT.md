# Fix: User Document Not Found in Firestore

## The Problem

Your console shows: "User document not found in Firestore for: FYsmnr11V1SBNPSvC0Gd0rFoFTb2"

This means you're logged in to Firebase Authentication, but the Firestore document doesn't exist yet.

## Quick Fix

### Step 1: Get Your User UID

The UID from the error is: `FYsmnr11V1SBNPSvC0Gd0rFoFTb2`

Or get it from:
- Firebase Console → Authentication → Users
- Find your email: glen.adamson@modern-software.co.uk
- Copy the User UID

### Step 2: Create the User Document

1. Go to **Firebase Console** → **Firestore Database** → **Data**
2. Click **"Start collection"** (if `users` doesn't exist)
3. Collection ID: `users`
4. Click **"Next"**
5. **Document ID**: `FYsmnr11V1SBNPSvC0Gd0rFoFTb2` (your User UID)
6. Add these fields:

   **Field 1:**
   - Field name: `email`
   - Type: **string**
   - Value: `glen.adamson@modern-software.co.uk`

   **Field 2:**
   - Field name: `role`
   - Type: **string**
   - Value: `admin` (to get admin access)

   **Field 3:**
   - Field name: `createdAt`
   - Type: **string**
   - Value: `2024-01-22T12:00:00.000Z` (or current date)

7. Click **"Save"**

### Step 3: Refresh

1. Go back to your website
2. **Refresh the page** (F5 or Cmd+R)
3. The warning should disappear
4. You should see "Role: admin" on the dashboard
5. You'll have access to admin features

## What Your Document Should Look Like

```
Collection: users
Document ID: FYsmnr11V1SBNPSvC0Gd0rFoFTb2
Fields:
  - email: "glen.adamson@modern-software.co.uk" (string)
  - role: "admin" (string)
  - createdAt: "2024-01-22T12:00:00.000Z" (string)
```

## After Creating the Document

- The console warning will disappear
- Your role will show as "admin" on the dashboard
- You'll see "Admin" in the navigation menu
- You can access `/admin/dashboard`
