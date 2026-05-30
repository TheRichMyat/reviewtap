# Scan & Say

QR codes for small business owners that redirect customers to their Google or Facebook review page. The app doesn't post reviews — it only removes friction by giving customers a clean, branded tap-through page.

## Project layout

```
Scan & Say/
├── landing/          # Static HTML/JS landing page (Firebase Hosting)
│   ├── public/       # index.html, app.js, styles.css, firebase-config.js
│   ├── firebase.json
│   ├── firestore.rules
│   └── .firebaserc
├── mobile/           # Expo React Native app
│   ├── App.js
│   ├── src/
│   │   ├── firebase.js
│   │   ├── theme.js
│   │   ├── components/
│   │   └── screens/
│   ├── assets/
│   ├── app.json
│   └── package.json
├── RIVEN.png         # Source logo
└── reviewtap-prd.md  # Product requirements
```

---

## 1. Firebase setup (once)

1. Go to [Firebase Console](https://console.firebase.google.com) → **Add project** → name it (e.g. `reviewtap`).
2. **Authentication** → Get started → enable **Email/Password** (and **Google** if you plan to use it).
3. **Firestore Database** → Create database → start in **production mode** → pick a region.
4. **Hosting** → Get started (no need to deploy yet — we'll do it from CLI).
5. **Project settings** (gear icon) → **Your apps** → click **`</>`** → register a web app called `reviewtap-web`. Copy the `firebaseConfig` object.

### Paste config in two places

**`landing/public/firebase-config.js`** — replace the placeholders with the values from Firebase Console.

**`mobile/src/firebase.js`** — replace the placeholders in `firebaseConfig`, and set `LANDING_BASE_URL` to your hosting domain (e.g. `https://reviewtap.web.app`).

Also edit **`landing/.firebaserc`** and replace `YOUR_PROJECT_ID` with your actual Firebase project ID.

---

## 2. Deploy the landing page

You need Node.js installed and the Firebase CLI:

```bash
npm install -g firebase-tools
firebase login
```

Then from the `landing/` folder:

```bash
cd landing
firebase deploy --only hosting,firestore:rules
```

Your landing page is now at `https://YOUR_PROJECT.web.app`. Test it with a fake business ID:

`https://YOUR_PROJECT.web.app/review/test123` → should show "Business not found" (because no business doc exists with that ID yet).

---

## 3. Run the mobile app

```bash
cd mobile
npm install
npx expo start
```

Then either:
- Scan the QR with the **Expo Go** app on your phone (iOS App Store / Android Play Store), or
- Press `a` to launch the Android emulator, or `i` for the iOS simulator (macOS only).

### First-time flow

1. Sign up with email + password.
2. Fill out business name + Google review URL (Facebook URL is optional).
3. The app generates a QR code that points to `LANDING_BASE_URL/review/{businessId}`.
4. Print the QR, share it, or save it to Photos.
5. When customers scan it, they land on your branded review page and tap through to Google/Facebook.

---

## 4. Find your Google review URL

In your [Google Business Profile dashboard](https://business.google.com), open your business → **Read reviews** → **Get more reviews** → copy the short link (usually `https://g.page/r/...`).

For Facebook, use your page URL (e.g. `https://facebook.com/yourpage`). The app appends `/reviews` automatically.

---

## 5. Enable Google Sign-In (optional)

The Login screen has a Google Sign-In button that currently shows a placeholder alert. To enable it:

1. `npx expo install expo-auth-session expo-crypto`
2. In Firebase Console → Authentication → **Sign-in method** → enable **Google**.
3. In [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Credentials**, create OAuth client IDs for **iOS**, **Android**, and **Web**.
4. Wire `expo-auth-session/providers/google` into `LoginScreen.js` (`handleGoogle`) using those client IDs.

Keep this for v1.1 — email/password is enough for MVP launch.

---

## 6. Build for Play Store

```bash
cd mobile
npm install -g eas-cli
eas login
eas build:configure
eas build --platform android --profile production
```

EAS produces a signed `.aab` you upload to the Play Console. See [Expo's Android build docs](https://docs.expo.dev/build/setup/) for the full walkthrough.

---

## Notes & constraints

- **MVP scope only** — one business per user, no payments, no Google/Facebook review API integration. The app is a redirect, not a posting tool.
- **Customer never logs in** — the landing page is fully public.
- **Firestore rules** allow public read of `businesses` (so the landing page works unauthenticated) and public write of `analytics` (for scan/click tracking). All authenticated writes are owner-scoped.
- **Firebase free tier (Spark plan)** is sufficient until you hit real volume.
