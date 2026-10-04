# Our Little World — Mobile App

This project is being converted from the existing web app into a native iOS + Android app using Capacitor.

## First setup in Codespaces

Run:

    npm install
    npm run build
    npx cap add android
    npx cap add ios
    npx cap sync

Then:

    npx cap open android
    npx cap open ios

## Native widgets

The native widget layer is intentionally separate from the existing HTML widgets.

- Android widgets will be implemented with the Android App Widget/Jetpack Glance APIs.
- iPhone Home Screen + Lock Screen widgets will be implemented with Apple's WidgetKit.
- The web app remains the shared UI inside the native app.
- Firebase/Firestore remains the shared data source.

The first native widget set will be:

1. Until We Meet — countdown to David's return.
2. Lusaka ↔ Baku — current local times.
3. Today's Little Note — shared note.
4. Memory of the Day — a small shared memory.
5. Our Little World — shortcut into the app.

The old in-page "Today in Our Little World" dashboard is not the native widget system.
