# SWIFTBOOKER
SWIFTBOOKER is designed to address inefficiencies in appointment processes by streamlining the scheduling and management of appointments with service providers. Aimed at reducing time wasted and the phone traffic congestion typical of traditional phone communication, the project seeks to digitize modern appointment processes.

# Demo APP SWIFTBOOKER
# https://drive.google.com/file/d/1qHp2rF1Ifsu0DbKET0YulQIN_cEqfl8T/view?usp=sharing

```markdown
# SwiftBooker

SwiftBooker is a mobile and web application built using React Native and Expo. It enables users to book services, manage appointments, and receive notifications about their bookings.

## Features

- User authentication with Firebase
- Calendar integration for booking and scheduling appointments
- Push notifications for reminders and alerts
- Dynamic UI with onboarding screens and smooth animations
- Easy service booking with categorized search and listings
- Cross-platform support (iOS, Android, Web)
- Notifications and toast messages for real-time updates

## Technologies Used

- **React Native (v0.74.5)**: Cross-platform mobile framework.
- **Expo (v51.0.28)**: A powerful framework for building React Native apps.
- **Expo Router (v3.5.23)**: Navigation system for routing.
- **Firebase (v10.13.1)**: Backend services for user authentication and real-time database.
- **Zustand (v4.5.5)**: Lightweight state management for managing global state.
- **Formik (v2.4.6)**: Form handling and validation.
- **React Navigation (v6.0.2)**: Navigation library for seamless in-app routing.
- **Expo Notifications**: Manage and send push notifications.
- **Expo Image Picker**: Image upload and management in the app.
- **React Native Calendars (v1.1306.0)**: Calendar component for booking and scheduling.
- **React Native Gesture Handler (v2.16.1)**: For smooth touch gestures and interactions.
- **React Native Reanimated (v3.10.1)**: For enhanced animations in the app.
- **React Native Toast Message (v2.2.0)**: Real-time toast notifications.
- **Lottie (v6.7.2)**: For rendering animations in the app.
- **Moment (v2.30.1)**: Library for date and time manipulation.
- **TypeScript (v5.3.3)**: Type-safe development.
- **Jest (v29.2.1)**: Unit testing for React Native components.

## Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

- **Node.js** and **Yarn** installed on your machine.
- **Expo CLI** installed globally:
  ```bash
  yarn global add expo-cli
  ```

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/swiftbooker.git
   ```

2. Navigate to the project directory:
   ```bash
   cd swiftbooker
   ```

3. Install the project dependencies:
   ```bash
   yarn install
   ```

### Configuration

1. **Firebase Setup**: Create a Firebase project and add your configuration to the app.

   - Go to [Firebase Console](https://console.firebase.google.com/) and create a project.
   - Add Firebase to your app and generate the configuration file (`google-services.json` for Android, `GoogleService-Info.plist` for iOS).
   - Replace or add the configuration in your project under `./android/app` and `./ios`.

2. **Environment Variables**: You may need to configure environment variables for Firebase or other third-party services.

   - Create a `.env` file in the root directory and add your keys:
     ```bash
     FIREBASE_API_KEY=your_firebase_api_key
     FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
     FIREBASE_PROJECT_ID=your_firebase_project_id
     ```

3. **Expo Setup**: Make sure you have an Expo account, and run the following command to log in and set up your environment:
   ```bash
   expo login
   ```

### Running the Application

1. Start the development server:
   ```bash
   yarn start
   ```

2. To run the app on Android:
   ```bash
   yarn android
   ```

3. To run the app on iOS:
   ```bash
   yarn ios
   yarn expo build or npx expo prebuild
   ```

4. To run the app on the web:
   ```bash
   yarn web
   ```

### Running Tests

To run the tests for the project using Jest:
```bash
yarn test
```

### Linting

To check for linting issues:
```bash
yarn lint
```

## Project Structure

```
├── assets/                 # Static assets (images, fonts)
├── components/             # Reusable components
├── navigation/             # Navigation configuration
├── screens/                # App screens (Login, Home, etc.)
├── store/                  # Zustand global state
├── utils/                  # Utility functions and helpers
├── App.js                  # Entry point of the app
├── app.json                # App configuration
└── package.json            # Project dependencies and scripts
```

## Scripts

- `yarn start`: Start the Expo development server.
- `yarn android`: Run the app on an Android emulator or device.
- `yarn ios`: Run the app on an iOS simulator or device.
- `yarn web`: Run the app in the web browser.
- `yarn test`: Run unit tests with Jest.
- `yarn lint`: Run the linter to check for code style issues.
- `yarn reset-project`: Reset the project configuration.

## Contributing

Contributions are welcome! Please fork this repository, create a new branch, and submit a pull request.

## License

This project is licensed under the MIT License.
```
This project is proprietary and does not fall under any open-source license. All rights are reserved. Unauthorized distribution, modification, or commercial use of this project is prohibited without explicit permission from the owner.
