/* A Little Place Called Us — shared cloud sync layer
   Firebase Firestore + anonymous authentication.
   Prevents cloud/local sync loops.
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
  let applyingRemote = false;
  let initialLoadComplete = false;
  let saveTimer = null;


  /* -----------------------------
     START FIREBASE
  ----------------------------- */

  function loadFirebase() {

    return new Promise((resolve, reject) => {

      try {

        if (!window.firebase) {
          throw new Error("Firebase library did not load.");
        }

        if (!firebase.apps.length) {
          firebase.initializeApp(FIREBASE_CONFIG);
        }

        db = firebase.firestore();

        firebase.auth()
          .signInAnonymously()
          .then(resolve)
          .catch(reject);

      } catch (error) {

        reject(error);

      }

    });

  }


  /* -----------------------------
     SAVE LOCAL DATA TO CLOUD
  ----------------------------- */

  function uploadCurrent() {

    if (!db || applyingRemote) return;

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

    const updatedAt = Number(
      localStorage.getItem(UPDATED_KEY) || Date.now()
    );

    db.collection(COLLECTION)
      .doc(DOC_ID)
      .set({
        world: localData,
        updatedAt: updatedAt
      })

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


  /* -----------------------------
     DELAYED SAVE
     Prevents multiple saves firing
     at the same time.
  ----------------------------- */

  function scheduleUpload() {

    if (!initialLoadComplete || applyingRemote) {
      return;
    }

    clearTimeout(saveTimer);

    saveTimer = setTimeout(() => {

      uploadCurrent();

    }, 500);

  }


  /* -----------------------------
     LISTEN FOR CLOUD CHANGES
  ----------------------------- */

  function startCloudListener() {

    db.collection(COLLECTION)
      .doc(DOC_ID)
      .onSnapshot(

        snapshot => {

          if (!snapshot.exists) {

            console.log(
              "[A Little Place Called Us] No cloud data yet."
            );

            initialLoadComplete = true;

            return;

          }

          const cloud = snapshot.data();

          if (!cloud || !cloud.world) {
            initialLoadComplete = true;
            return;
          }

          const cloudUpdated = Number(
            cloud.updatedAt || 0
          );

          const localUpdated = Number(
            localStorage.getItem(UPDATED_KEY) || 0
          );


          /*
            If this device already has the exact
            same version, do absolutely nothing.

            This is what prevents the cloud/local
            save loop.
          */

          if (
            cloudUpdated === localUpdated &&
            localStorage.getItem(DATA_KEY) ===
            JSON.stringify(cloud.world)
          ) {

            initialLoadComplete = true;

            return;

          }


          /*
            Never overwrite newer local changes.
          */

          if (cloudUpdated < localUpdated) {

            initialLoadComplete = true;

            // This device has the newer copy. Push it to the shared cloud
            // instead of silently keeping the two devices out of sync.
            uploadCurrent();

            return;

          }


          /*
            Apply cloud data locally.
          */

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

          initialLoadComplete = true;

        },

        error => {

          console.error(
            "[A Little Place Called Us] Cloud listener error:",
            error
          );

        }

      );

  }


  /* -----------------------------
     WATCH WEBSITE CHANGES
  ----------------------------- */

  const originalSetItem = Storage.prototype.setItem;

  Storage.prototype.setItem = function (key, value) {

    originalSetItem.call(this, key, value);

    if (
      key === DATA_KEY &&
      !applyingRemote
    ) {

      scheduleUpload();

    }

  };


  /* -----------------------------
     START EVERYTHING
  ----------------------------- */

  loadFirebase()

    .then(() => {

      console.log(
        "[A Little Place Called Us] Firebase connected ✓"
      );

      window.__aliceD_cloud_ready = true;

      /*
        Start listening first.
        This allows the cloud copy to load before
        we start uploading local changes.
      */

      startCloudListener();

      /*
        Give the listener a moment to establish the
        initial state before enabling automatic saves.
      */

      setTimeout(() => {

        initialLoadComplete = true;

      }, 1000);

    })

    .catch(error => {

      console.error(
        "[A Little Place Called Us] Firebase could not start:",
        error
      );

    });

})();