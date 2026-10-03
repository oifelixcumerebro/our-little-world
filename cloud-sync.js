/* A Little Place Called Us — shared cloud sync layer
   Firebase Firestore + anonymous authentication.
*/

(function () {

  const FIREBASE_CONFIG = {
    apiKey: "AIzaSyBLQB9Cd7HvcOBTjScv_WpbqneXEbO5RE0",
    authDomain: "our-little-world-3fb42.firebaseapp.com",
    projectId: "our-little-world-3fb42",
    storageBucket: "our-little-world-3fb42.firebasestorage.app",
    messagingSenderId: "397017583399",
    appId: "1:397017583399:web:303387e1cdaa947985e302"
  };

  const COLLECTION = "coupleWorlds";
  const DOC_ID = "alice-david";
  const DATA_KEY = "aliceD_little_world_data_v2";
  const UPDATED_KEY = DATA_KEY + "_updated";

  let db = null;
  let firestore = null;
  let applyingRemote = false;

  function loadFirebase() {

    return Promise.all([
      import("https://www.gstatic.com/firebase/11.0.2/firebase-app.js"),
      import("https://www.gstatic.com/firebase/11.0.2/firebase-auth.js"),
      import("https://www.gstatic.com/firebase/11.0.2/firebase-firestore.js")
    ])

    .then(([appMod, authMod, firestoreMod]) => {

      const app = appMod.initializeApp(FIREBASE_CONFIG);

      const auth = authMod.getAuth(app);

      db = firestoreMod.getFirestore(app);
      firestore = firestoreMod;

      return authMod.signInAnonymously(auth);
    });
  }


  function uploadCurrent() {

    if (!db || !firestore || applyingRemote) return;

    let localData;

    try {
      localData = JSON.parse(
        localStorage.getItem(DATA_KEY) || "null"
      );
    } catch (error) {
      console.error(
        "[A Little Place Called Us] Could not read local data:",
        error
      );
      return;
    }

    if (!localData) return;

    const updatedAt =
      Number(localStorage.getItem(UPDATED_KEY) || Date.now());

    firestore.setDoc(
      firestore.doc(db, COLLECTION, DOC_ID),
      {
        world: localData,
        updatedAt: updatedAt
      },
      {
        merge: false
      }
    )
    .then(() => {
      console.log(
        "[A Little Place Called Us] Cloud save successful ✓"
      );
    })
    .catch(error => {
      console.error(
        "[A Little Place Called Us] Cloud save failed:",
        error
      );
    });
  }


  function startCloudListener() {

    const ref = firestore.doc(
      db,
      COLLECTION,
      DOC_ID
    );

    firestore.onSnapshot(
      ref,

      snapshot => {

        if (!snapshot.exists()) {
          console.log(
            "[A Little Place Called Us] No cloud data yet."
          );
          return;
        }

        const cloud = snapshot.data();

        if (!cloud || !cloud.world) return;

        const cloudUpdated =
          Number(cloud.updatedAt || 0);

        const localUpdated =
          Number(
            localStorage.getItem(UPDATED_KEY) || 0
          );

        /*
          Do not overwrite newer local changes.
        */
        if (cloudUpdated < localUpdated) {
          return;
        }

        applyingRemote = true;

        try {

          localStorage.setItem(
            DATA_KEY,
            JSON.stringify(cloud.world)
          );

          localStorage.setItem(
            UPDATED_KEY,
            String(cloudUpdated)
          );

          window.dispatchEvent(
            new CustomEvent("aliceD:cloud-updated")
          );

          console.log(
            "[A Little Place Called Us] Cloud data loaded ✓"
          );

        } finally {

          applyingRemote = false;

        }

      },

      error => {

        console.error(
          "[A Little Place Called Us] Cloud listener error:",
          error
        );

      }
    );
  }


  /*
    Watch for changes made by the website.

    This means when Alice or David adds:
    - memories
    - recipes
    - movies
    - songs
    - letters
    - future-board items

    the changed data is uploaded automatically.
  */

  const originalSetItem = Storage.prototype.setItem;

  Storage.prototype.setItem = function (key, value) {

    originalSetItem.call(this, key, value);

    if (
      key === DATA_KEY &&
      !applyingRemote
    ) {
      setTimeout(uploadCurrent, 0);
    }
  };


  /*
    Start Firebase.
  */

  loadFirebase()

    .then(() => {

      console.log(
        "[A Little Place Called Us] Firebase connected ✓"
      );

      window.__aliceD_cloud_ready = true;

      startCloudListener();

      /*
        Upload whatever is currently on this device.
        This gives the cloud its initial copy.
      */
      uploadCurrent();

    })

    .catch(error => {

      console.error(
        "[A Little Place Called Us] Firebase could not start:",
        error
      );

    });

})();