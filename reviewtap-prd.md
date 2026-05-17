# ReviewTap — Product Requirements Document (PRD)

## 1. Product Overview

ReviewTap is a lightweight mobile app for small business owners to generate QR codes that direct customers to their Google Business Profile or Facebook Page review sections. The customer scans the QR code with their native camera, opens a branded landing page, and taps a button to leave a review on their chosen platform. The app does NOT post reviews on behalf of users — it only removes friction by providing a clean, trackable redirect.

---

## 2. Branding & Design System

### App Identity
- **App Name:** ReviewTap
- **Logo Mark:** "RT." in bold white geometric sans-serif
- **Typography:** Inter (or system default SF Pro / Roboto). Bold for headings, Regular for body.
- **Primary Gradient:** `#4F6DFF` (electric blue) → `#9B30FF` (violet)

### UI Rules
- **Backgrounds:** Gradient used for splash, login, and QR display screens. White (`#FFFFFF`) for forms, cards, and dashboard.
- **Text:** White text on gradient backgrounds. Dark gray (`#1A1A1A`) on white surfaces.
- **Buttons:** Gradient fill for primary actions. White with gradient border for secondary.
- **Cards:** White background, subtle shadow (`0 2px 8px rgba(0,0,0,0.08)`), 12px border radius.
- **Simplicity Rule:** No illustrations, no mascots, no 3D elements. Clean, Stripe/Notion-level minimalism.

---

## 3. Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Mobile App | React Native (Expo) | Cross-platform, fast vibe-coding, easy Play Store deployment |
| Authentication | Firebase Authentication | Google Sign-In + Email/Password |
| Database | Cloud Firestore | Business data, analytics, user profiles |
| Hosting | Firebase Hosting | Landing page deployment |
| Landing Page | Next.js (or plain HTML/JS if preferred) | Customer-facing review redirect page |
| QR Generation | `qrcode` npm package | Generate QR images in-app |
| Storage | Firebase Storage (optional) | Save generated QR images for sharing |

---

## 4. Database Schema (Firestore)

### Collection: `users`
```
{
  uid: string,           // Firebase Auth UID
  email: string,
  displayName: string,
  photoURL: string,      // (optional) Google profile photo
  createdAt: timestamp
}
```

### Collection: `businesses`
```
{
  businessId: string,    // Auto-generated Firestore ID
  ownerId: string,       // Reference to users.uid
  businessName: string,
  googleReviewUrl: string,    // Direct Google review URL
  facebookPageUrl: string,    // Facebook page reviews URL
  qrCodeDataUrl: string,      // Base64 QR image (optional)
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Collection: `analytics`
```
{
  eventId: string,       // Auto-generated
  businessId: string,    // Reference to businesses.businessId
  eventType: string,     // "scan" | "google_click" | "facebook_click"
  timestamp: timestamp,
  userAgent: string,     // (optional) Device/browser info
  ipHash: string         // (optional) Hashed IP for basic uniqueness
}
```

### Firestore Security Rules (MVP)
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /businesses/{businessId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.ownerId;
      allow create: if request.auth != null;
    }
    match /analytics/{eventId} {
      allow read: if request.auth != null && request.auth.uid == get(/databases/$(database)/documents/businesses/$(resource.data.businessId)).data.ownerId;
      allow create: if true;  // Public write from landing page
    }
  }
}
```

---

## 5. User Flows

### Flow A: Business Owner (Mobile App)

1. **Splash Screen** — Gradient background with white "RT." logo centered. Fades to login after 2 seconds.
2. **Login Screen** — Two options: "Sign in with Google" (primary gradient button) or "Sign in with Email" (secondary). No passwordless magic links for MVP.
3. **Onboarding / Business Setup** — First-time users see a form:
   - Business Name (text input)
   - Google Business Profile Review URL (text input, with helper text: "Find this in your Google Business dashboard under 'Get more reviews'")
   - Facebook Page URL (text input, optional)
   - "Save & Generate QR" button
4. **QR Display Screen** —
   - Large QR code centered on screen
   - Business name below QR
   - "Download QR" button (saves to camera roll)
   - "Share QR" button (opens native share sheet with QR image + message: "Scan to leave us a review!")
   - "View Dashboard" button
5. **Dashboard Screen** —
   - Two stat cards: "Total Scans" and "Review Link Clicks"
   - Simple 7-day bar chart (or just numbers for MVP)
   - "Edit Business Info" button
   - "Regenerate QR" button (in case URL changes)
6. **Settings Screen** —
   - Edit business info
   - Log out

### Flow B: Customer (No App — Browser Only)

1. **Scan QR** — Customer scans with native phone camera
2. **Open Landing Page** — Browser opens `https://reviewtap.web.app/review/{businessId}`
3. **See Branded Page** —
   - Top: Gradient header with "RT." logo mark (small, top-left)
   - Center: "How was your experience at **[Business Name]**?"
   - Two large buttons:
     - "Review on Google" (with Google "G" icon)
     - "Review on Facebook" (with Facebook "f" icon, hidden if no Facebook URL saved)
   - Bottom: "Powered by ReviewTap" in small text
4. **Tap Button** — Browser redirects to Google Maps review page or Facebook page reviews tab
5. **Analytics Fired** — Firestore document created on page load (scan) and button click

---

## 6. Screen Specifications

### Screen 1: Splash
- Full gradient background (`#4F6DFF` → `#9B30FF`)
- White "RT." text, 48px, bold, centered
- After 2s auto-navigate to Login (if not authenticated) or Dashboard (if authenticated)

### Screen 2: Login
- Gradient background
- "RT." logo at top center
- "Welcome to ReviewTap" — white, 24px bold
- "Sign in with Google" — gradient button, white text, Google icon left
- "Sign in with Email" — white button, gradient border, dark text
- Email form (appears when "Sign in with Email" tapped):
  - Email input
  - Password input
  - "Sign In" gradient button
  - "Create Account" text link below

### Screen 3: Business Setup
- White background
- Header: "Set Up Your Business" — 20px bold
- Form fields (see Flow A.3)
- "Save & Generate QR" — gradient button, full width
- Helper text below: "You can edit this anytime in Settings"

### Screen 4: QR Display
- Gradient background
- White card in center (rounded 16px, padding 24px)
- Inside card: QR code image, 250x250px
- Below card: Business name in white, 18px bold
- Action buttons (stacked vertically, 16px gap):
  - "Download to Photos" — white button, dark text
  - "Share QR Code" — white button, dark text
  - "Go to Dashboard" — transparent button, white text, 1px white border

### Screen 5: Dashboard
- White background
- Header gradient bar: "RT." left, "Dashboard" center
- Stat row (two cards side by side):
  - Left card: "Total Scans" — large number, small label
  - Right card: "Link Clicks" — large number, small label
- "Activity This Week" section — list of last 5 events (or simple "No activity yet" state)
- Floating gradient "+" button (bottom right) — regenerates to QR display
- Bottom nav (3 tabs): Dashboard | QR Code | Settings

### Screen 6: Settings
- White background
- Header: "Settings"
- "Edit Business Info" — row with chevron
- "How It Works" — row with chevron (opens simple modal)
- "Log Out" — red text row

---

## 7. Landing Page Specification

### URL Structure
`https://your-domain.com/review/{businessId}`

### Layout
```
[Gradient Header Bar]
  RT. logo (small, left) | "ReviewTap" (small, right)

[White Card — Centered, max-width 480px]
  "How was your experience at"
  [Business Name] — 24px bold
  "Your feedback helps us grow!" — 14px gray

  [Google Button]
    G icon + "Review on Google"
    Gradient border, white fill, dark text

  [Facebook Button]
    f icon + "Review on Facebook"
    Gradient border, white fill, dark text
    (Hidden if no Facebook URL configured)

[Footer]
  "Powered by ReviewTap" — 12px gray
```

### Behavior
- On page load: Fire `analytics` document with `eventType: "scan"`
- On Google button tap: Fire `analytics` document with `eventType: "google_click"`, then `window.location.href = googleReviewUrl`
- On Facebook button tap: Fire `analytics` document with `eventType: "facebook_click"`, then `window.location.href = facebookPageUrl/reviews`
- If `businessId` not found: Show "Business not found" with small RT. logo

### Styling
- Background: Subtle gradient or light gray `#F5F5F7`
- Card: White, shadow, 16px radius
- Buttons: 48px height, 12px radius, gradient border 2px
- Font: Inter or system sans-serif

---

## 8. Critical Constraints & Rules

1. **NO REVIEW POSTING API** — The app never attempts to post a review on behalf of a customer. There is no Google or Facebook API for this. Redirect only.
2. **CUSTOMER NEVER LOGS IN** — The landing page is fully public. Zero authentication required for customers.
3. **MVP = NO PAYMENTS** — No Stripe, no in-app purchases, no subscriptions. Focus on trust and usage first.
4. **QR ENCODES WEB URL** — The QR code contains `https://your-domain.com/review/{businessId}`, not a deep link into the mobile app.
5. **ONE BUSINESS PER USER (MVP)** — A user can only create one business profile in the first version. Multi-business support comes later.
6. **NO COMPLEX ANALYTICS** — Track scans and clicks only. Do not attempt to verify if a review was actually written.
7. **FIREBASE FREE TIER FIRST** — Build within Spark plan limits. Upgrade only when you have paying customers.

---

## 9. Build Order (Priority)

### Day 1: Firebase Foundation
- Create Firebase project
- Enable Authentication (Google + Email/Password)
- Set up Firestore database
- Deploy Firestore security rules
- Set up Firebase Hosting for landing page

### Day 2: Landing Page (DEPLOY FIRST)
- Build Next.js (or HTML) landing page
- Connect to Firestore to fetch business by ID
- Implement scan + click analytics
- Style with branding system
- Deploy to Firebase Hosting
- Test with a mock business ID

### Day 3: Mobile App — Auth & Setup
- Expo project scaffold
- Splash screen with gradient + RT. logo
- Firebase Auth integration (Google + Email)
- Business setup form
- Save to Firestore

### Day 4: Mobile App — QR & Dashboard
- QR code generation (`qrcode` library)
- QR display screen (download + share)
- Dashboard screen (fetch analytics from Firestore)
- Bottom tab navigation

### Day 5: Polish & Test
- Test full flow with real Google review URL
- Test on Android device
- Play Store build (AAB generation)
- Screenshots for Play Store listing

---

## 10. Deliverables

Claude Code should output:

1. **Expo Project** — Complete React Native app with all screens described above
2. **Landing Page Folder** — Next.js (or static HTML) project ready for Firebase Hosting
3. **Firebase Config** — `firebaseConfig.js` with instructions to replace placeholders
4. **README.md** — Step-by-step setup:
   - How to create Firebase project
   - Where to paste config keys
   - How to run Expo locally
   - How to deploy landing page
   - How to build Play Store AAB

---

## 11. Future Features (Post-MVP)

- **Pro Tier:** Multiple businesses per account, custom branding colors, SMS review reminders
- **Google Business Profile API Integration:** Actually fetch and display incoming review count
- **Multi-language Support:** Spanish, etc.
- **Review Request via SMS:** Business owner enters customer phone number, app sends text with review link
- **Sticker Generator:** Print-ready PDF with QR + "Scan to Review" text

---

*Document Version: 1.0*  
*For: ReviewTap MVP Build*  
*Builder: Claude Code*  
*Constraint: Build only what is listed above. Do not add unlisted features.*
