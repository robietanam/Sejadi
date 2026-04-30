# Sejadi

A React Native app with a Node.js backend. Handles user authentication and session management.

## Requirements

- **Node.js**: LTS 20
- **Java**: JDK 17
- **Android NDK**: 27.1.12297006
- **React Native**: 0.81.5

## Getting Started

### Server Setup

```bash
cd server
npm i
npm run build
npm run start
```

The server runs on `http://localhost:3000` by default.

### Client Setup (Android)

```bash
cd client
npm i
npm run android
```

This builds and runs the app on your connected Android device or emulator using Expo.

## Project Structure

- **server/**: NestJS backend with auth, user management, and session handling
- **client/**: React Native app built with Expo, handles login, registration, and user sessions

## What's Inside

The app includes basic user authentication, profile management, and session tracking. The backend handles JWT-based auth and the client stores credentials securely.

## Dev Notes

- Make sure your Android device/emulator is connected before running `npm run android`
- The server needs to be running for the app to work properly
- Check the individual README files in `/server` and `/client` for more specific details
