# NoteNest Portfolio & Notes App

This is a Next.js application built with Firebase, serving as a personal portfolio website for K. Komal Eshwara Kumar (KKEK) and including a protected note-taking feature called NoteNest.

## Features

- **Portfolio Section:**
  - Hero section introducing KKEK.
  - About Me section with a detailed bio.
  - Experience section showcasing professional roles and leadership.
  - Projects section with filterable project cards and detailed modals.
  - Skills section with categorized skills and proficiency indicators.
  - Contact section with social links and email.
- **NoteNest Section:**
  - Access code protected area for personal notes and key information.
  - Create, view, edit, and delete notes or key information.
  - AI-powered summarization for notes.
  - Sort items by type (Note / Key Information).
  - Copy key information values and AI summaries to clipboard.
- **General Features:**
  - Responsive design for various screen sizes.
  - Dark/Light mode toggle.
  - Built with modern web technologies.
  - Smooth scroll animations and interactive UI elements.

## Tech Stack

- **Frontend:**
  - Next.js (App Router)
  - React
  - TypeScript
  - Tailwind CSS
  - ShadCN UI (for UI components)
- **Backend & Database:**
  - Firebase (Firestore for database, potentially Firebase Auth if expanded)
- **AI Integration:**
  - Genkit (for AI-powered note summarization)
- **Styling & Animations:**
  - Tailwind CSS
  - Lucide React (for icons)
  - Framer Motion (implicitly via ShadCN UI and custom animations)
- **Development Tools:**
  - ESLint, Prettier (assumed for code quality)
  - VSCode

## Getting Started

### Prerequisites

- Node.js (v18 or later recommended)
- npm or yarn
- Firebase Account and Project

### Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Set up Firebase:**
    - Create a Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/).
    - In your Firebase project, go to Project settings > General.
    - Find your Firebase SDK setup snippet and copy the configuration values.
    - Create a `.env.local` file in the root of your project (if it doesn't exist) and add your Firebase configuration:
      ```env
      NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
      NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
      NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
      NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
      NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
      NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
      NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

      # Access code for the Notes section
      NEXT_PUBLIC_NOTES_ACCESS_CODE=your_secret_access_code_here
      ```
    - **Important:** Replace `your_...` placeholders with your actual Firebase project credentials and choose a secure access code for `NEXT_PUBLIC_NOTES_ACCESS_CODE`.
    - Set up Firestore in your Firebase project:
        - Go to Firestore Database in the Firebase console.
        - Create a database (choose production mode and your preferred location).
        - Update Firestore security rules (`firestore.rules`) as needed for your application. The current rules allow read/write until a specific date.

4.  **Set up Genkit (Google AI):**
    - Ensure you have a Google Cloud project with the Vertex AI API enabled.
    - Set up authentication for Google AI, typically by running:
      ```bash
      gcloud auth application-default login
      ```
    - Genkit uses `GOOGLE_API_KEY` or application default credentials. If using an API key, add it to your `.env.local`:
      ```env
      GOOGLE_API_KEY=your_google_ai_api_key
      ```

## Available Scripts

In the project directory, you can run:

-   **`npm run dev` or `yarn dev`**:
    Runs the app in development mode.
    Open [http://localhost:9002](http://localhost:9002) (or the port specified in your `package.json`) to view it in the browser.
    The page will reload if you make edits.

-   **`npm run genkit:dev` or `yarn genkit:dev`**:
    Starts the Genkit development server for local AI flow testing.

-   **`npm run genkit:watch` or `yarn genkit:watch`**:
    Starts the Genkit development server in watch mode.

-   **`npm run build` or `yarn build`**:
    Builds the app for production to the `.next` folder.
    It correctly bundles React in production mode and optimizes the build for the best performance.

-   **`npm run start` or `yarn start`**:
    Starts the production server (after running `build`).

-   **`npm run lint` or `yarn lint`**:
    Lints the codebase using Next.js's built-in ESLint configuration.

-   **`npm run typecheck` or `yarn typecheck`**:
    Runs TypeScript type checking.

## Environment Variables

The following environment variables are used:

-   `NEXT_PUBLIC_FIREBASE_API_KEY`: Firebase API Key
-   `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`: Firebase Auth Domain
-   `NEXT_PUBLIC_FIREBASE_PROJECT_ID`: Firebase Project ID
-   `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`: Firebase Storage Bucket
-   `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`: Firebase Messaging Sender ID
-   `NEXT_PUBLIC_FIREBASE_APP_ID`: Firebase App ID
-   `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`: Firebase Measurement ID (optional, for Analytics)
-   `NEXT_PUBLIC_NOTES_ACCESS_CODE`: Access code for the protected "Notes" section.
-   `GOOGLE_API_KEY`: (Optional, if not using ADC) API key for Google AI services used by Genkit.

Create a `.env.local` file in the root directory to store these values.

## Deployment

This application is configured for deployment with Firebase App Hosting (see `apphosting.yaml`). You can also deploy it to other platforms that support Next.js applications (e.g., Vercel, Netlify).

---

This README provides a basic overview. Feel free to expand it with more details specific to your project development and deployment practices.
