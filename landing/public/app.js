import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  addDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const card = document.getElementById("card");
const loading = document.getElementById("loading");
const notfound = document.getElementById("notfound");
const nameEl = document.getElementById("businessName");
const googleBtn = document.getElementById("googleBtn");
const facebookBtn = document.getElementById("facebookBtn");

function getBusinessId() {
  const match = location.pathname.match(/\/review\/([^/]+)/);
  if (match) return decodeURIComponent(match[1]);
  return new URLSearchParams(location.search).get("id");
}

async function logEvent(businessId, eventType) {
  try {
    await addDoc(collection(db, "analytics"), {
      businessId,
      eventType,
      timestamp: serverTimestamp(),
      userAgent: navigator.userAgent,
    });
  } catch (err) {
    console.warn("analytics failed", err);
  }
}

async function main() {
  const businessId = getBusinessId();
  console.log("[ReviewTap] businessId from URL:", businessId);
  if (!businessId) {
    loading.hidden = true;
    notfound.hidden = false;
    return;
  }

  let snap;
  try {
    snap = await getDoc(doc(db, "businesses", businessId));
  } catch (err) {
    console.error("[ReviewTap] Firestore read failed:", err);
    loading.textContent = `Error: ${err.code || err.message}`;
    return;
  }

  console.log("[ReviewTap] doc exists:", snap.exists(), "data:", snap.data());
  if (!snap.exists()) {
    loading.hidden = true;
    notfound.hidden = false;
    return;
  }

  const data = snap.data();
  nameEl.textContent = data.businessName || "this business";
  document.title = `Review ${data.businessName || "us"} — ReviewTap`;

  if (data.googleReviewUrl) {
    googleBtn.hidden = false;
    googleBtn.addEventListener("click", async () => {
      await logEvent(businessId, "google_click");
      window.location.href = data.googleReviewUrl;
    });
  }

  if (data.facebookPageUrl) {
    facebookBtn.hidden = false;
    facebookBtn.addEventListener("click", async () => {
      await logEvent(businessId, "facebook_click");
      const url = data.facebookPageUrl.replace(/\/?$/, "/reviews");
      window.location.href = url;
    });
  }

  loading.hidden = true;
  card.hidden = false;

  logEvent(businessId, "scan");
}

main().catch((err) => {
  console.error(err);
  loading.hidden = true;
  notfound.hidden = false;
});
