/* A Little Place Called Us — shared cloud sync layer
   Uses Firebase Firestore + anonymous authentication.
   It is intentionally optional: until Firebase is configured, the existing
   localStorage version continues to work exactly as before.
*/
(function () {
  const FIREBASE_CONFIG = {
    apiKey: "PASTE_FIREBASE_API_KEY_HERE",
    authDomain: "PASTE_FIREBASE_PROJECT_ID.firebaseapp.com",
    projectId: "PASTE_FIREBASE_PROJECT_ID",
    storageBucket: "PASTE_FIREBASE_PROJECT_ID.firebasestorage.app",
    messagingSenderId: "PASTE_FIREBASE_MESSAGING_SENDER_ID_HERE",
    appId: "PASTE_FIREBASE_APP_ID_HERE"
  };

  const configured = Object.values(FIREBASE_CONFIG).every(v =>
    typeof v === "string" &&
    v &&
    !v.includes("PASTE_FIREBASE_") &&
    !v.includes("PASTE_FIREBASE_PROJECT_ID")
  );

  if (!configured) {
    console.info("[A Little Place Called Us] Cloud sync is not configured yet. Local saving remains active.");
    return;
  }

  const COLLECTION = "coupleWorlds";
  const DOC_ID = "alice-david";
  const DATA_KEY = "aliceD_little_world_data_v2";
  const UPDATED_KEY = DATA_KEY + "_updated";
  let db = null;
  let remoteListenerStarted = false;
  let applyingRemote = false;

  function loadFirebase() {
    return Promise.all([
      import("https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js"),
      import("https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js"),
      import("https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js")
    ]).then(([appMod, authMod, firestoreMod]) => {
      const app = appMod.initializeApp(FIREBASE_CONFIG);
      const auth = authMod.getAuth(app);
      db = firestoreMod.getFirestore(app);

      return authMod.signInAnonymously(auth).then(() => ({
        firestoreMod,
        auth
      }));
    });
  }

  function replaceLocalData(remote) {
    if (!remote || typeof remote !== "object") return;
    applyingRemote = true;
    try {
      localStorage.setItem(DATA_KEY, JSON.stringify(remote));
      localStorage.setItem(UPDATED_KEY, String(Date.now()));
    } finally {
      applyingRemote = false;
    }
  }

  function refreshOpenPanel() {
    const panel = document.getElementById("panel");
    if (!panel || panel.classList.contains("hidden")) return;
    const open = document.querySelector(".room.active-room");
    if (open && open.dataset.panelType && typeof window.showPanel === "function") {
      window.showPanel(open.dataset.panelType);
    }
  }

  function startListener(firestoreMod) {
    if (remoteListenerStarted) return;
    remoteListenerStarted = true;
    const ref = firestoreMod.doc(db, COLLECTION, DOC_ID);
    firestoreMod.onSnapshot(ref, snap => {
      if (!snap.exists()) return;
      const remote = snap.data().world;
      if (!remote) return;
      const remoteUpdated = Number(snap.data().updatedAt || 0);
      const localUpdated = Number(localStorage.getItem(UPDATED_KEY) || 0);
      if (remoteUpdated < localUpdated) return;
      replaceLocalData(remote);
      window.dispatchEvent(new CustomEvent("aliceD:cloud-updated"));
      refreshOpenPanel();
    }, err => {
      console.error("[A Little Place Called Us] Cloud listener error:", err);
    });
  }

  function uploadCurrent() {
    if (!db || applyingRemote) return;
    let local;
    try {
      local = JSON.parse(localStorage.getItem(DATA_KEY) || "null");
    } catch (_) {
      return;
    }
    if (!local) return;

    const firestoreMod = window.__aliceD_firestore;
    if (!firestoreMod) return;
    const updatedAt = Number(localStorage.getItem(UPDATED_KEY) || Date.now());

    firestoreMod.setDoc(
      firestoreMod.doc(db, COLLECTION, DOC_ID),
      { world: local, updatedAt },
      { merge: false }
    ).catch(err => console.error("[A Little Place Called Us] Cloud save error:", err));
  }

  loadFirebase().then(({ firestoreMod }) => {
    window.__aliceD_firestore = firestoreMod;
    startListener(firestoreMod);
    window.dispatchEvent(new CustomEvent("aliceD:cloud-ready"));
    uploadCurrent();
  }).catch(err => {
    console.error("[A Little Place Called Us] Cloud sync could not start:", err);
  });

  const originalSaveData = window.saveData;
  if (typeof originalSaveData === "function") {
    window.saveData = function (d) {
      originalSaveData(d);
      uploadCurrent();
    };
  }

  window.addEventListener("aliceD:cloud-ready", uploadCurrent);
})();
