# Rescue365

![Rescue365 Logo](Rescue365Logo.png)

Rescue365 is a mobile application designed to streamline the process of animal rescue. The app enables users to quickly report injured animals and notifies nearby rescuers specializing in animal rehabilitation and rehoming. By integrating geolocation, real-time notifications, and Supabase backend services, Rescue365 ensures timely responses and effective coordination between community members and professional rescuers.

---

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## Features

- **Case Reporting:** Users can submit detailed case reports including animal condition, location, and photos.
- **Real-Time Notifications:** The system notifies nearby rescuers when a case report is filed.
- **Geolocation Services:** Uses geolocation data to match animal cases with rescuers in the vicinity.
- **Supabase Integration:** Leverages Supabase for authentication, real-time database services, and edge functions for server-side logic.
- **User-Friendly Interface:** Built with React Native and Expo for a seamless mobile experience.

---

## Technology Stack

- **Frontend:** React Native, Expo, JavaScript/TypeScript
- **Backend:** Supabase (Authentication, Realtime Database, Edge Functions)
- **Additional Libraries:** 
  - Geolocation APIs for location tracking
  - Push notification services
  - Standard React Native components for UI

---

## Project Structure

```plaintext
Rescue365/
├── .expo/                  # Expo configuration and cache files
├── node_modules/           # Project dependencies
├── Rescue365/              # Source code for the mobile application
│   ├── components/         # Reusable UI components
│   ├── screens/            # App screens (e.g., Home, ReportCase, RescueList)
│   └── services/           # API calls, geolocation, and notification logic using Supabase
├── App.js                  # Main application entry point
├── package.json            # Project metadata and dependencies
├── tsconfig.json           # TypeScript configuration (if applicable)
├── Rescue365Logo.png       # Logo for the project
└── README.md               # Project documentation (this file)
```
## Installation
Prerequisites
Node.js (LTS version recommended)

Expo CLI

Git

Steps
Clone the repository:

bash
Copy
git clone https://github.com/Rescue365-org/r365.git
cd r365
Install dependencies:

bash
Copy
npm install
Set up Supabase:

Create a Supabase project at Supabase.

Obtain your Supabase configuration details (API URL, anon key, etc.).

Update your Supabase configuration in the project (typically within the configuration file in the Rescue365 or services folder).

## Run the App:

bash
Copy
expo start
Usage
Reporting a Case: Launch the app, navigate to the "Report Case" screen, fill in the details (including uploading images if needed), and submit.

Rescuer Notification: Upon case submission, the app triggers an edge function in Supabase to notify nearby rescuers.

Case Tracking: Both reporters and rescuers can track the status of the reported case in real-time.

