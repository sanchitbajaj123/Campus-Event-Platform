# Campus Event Platform

A modern, interactive, and role-based platform for managing campus events. This application provides a seamless experience for students to discover and register for events, and for organizers and administrators to manage them effectively. The entire application runs in the browser, using `localStorage` to persist data for a realistic demo experience.

## Website Live Link

https://campuseventmanager.netlify.app

## Key Features

- **Role-Based Access Control**: Three distinct user roles (Student, Organizer, Admin) with tailored permissions.
- **Interactive Event Listings**: Students can browse a list of upcoming events with real-time attendee counts.
- **Seamless Registration**: Students can register for events with a single click, with their registration status updating in real-time.
- **Organizer Dashboard**: Organizers can view registrations for their events, approve or reject pending requests, and manage event details.
- **Powerful Admin Panel**: Admins have full oversight, including:
  - Managing all events (add/delete).
  - Managing all users (add/delete organizers, view all students).
  - Viewing all registrations across the platform.
- **Persistent Data**: Uses the browser's `localStorage` to save all users, events, and registrations, so your data is preserved across sessions.
- **Modern & Responsive UI**: A clean, professional, and mobile-friendly interface built with Tailwind CSS.

## Tech Stack

- **Frontend**: [React](https://reactjs.org/) & [TypeScript](https://www.typescriptlang.org/)
- **Routing**: [React Router](https://reactrouter.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Development & Build Tool**: [Vite](https://vitejs.dev/)

---

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You need to have [Node.js](https://nodejs.org/) (which includes `npm` and `npx`) installed on your system.

### Installation & Running Locally

1.  **Download or Clone the Project**:
    Get all the project files onto your local machine.

2.  **Navigate to the Project Directory**:
    Open your terminal or command prompt and move into the project's root folder.
    ```bash
    cd path/to/campus-events-app
    ```

3.  **Install Dependencies**:
    This project uses modern tooling and doesn't require a heavy `node_modules` folder. The `package.json` file helps manage the necessary tools like Vite.
    ```bash
    npm install
    ```

4.  **Run the Development Server**:
    Execute the following command to start the Vite development server.
    ```bash
    npm run dev
    ```
    Vite will start the server and provide you with a local URL, typically `http://localhost:5173`. Open this URL in your web browser to see the application live.

---

## Available Roles & Credentials

The platform is pre-configured with default accounts for administrators and organizers. Students can sign up for a new account.

-   **Admin Account**:
    -   **Email**: `admin@campus.com`
    -   **Password**: `password123`

-   **Organizer Account**:
    -   **Email**: `organizer@campus.com`
    -   **Password**: `password123`

-   **Student Account**:
    -   Navigate to the **Sign Up** page to create a new student account.

---

## Deployment

This project is a static site and can be deployed easily to any static hosting provider.

1.  **Build the Project**:
    Run the build command to compile and optimize the application for production.
    ```bash
    npm run build
    ```
    This command will create a `dist` folder in your project directory. This folder contains all the static files (HTML, CSS, JS) needed to run your application.

2.  **Deploy to a Host**:
    Deploy the contents of the `dist` folder to your preferred hosting service. Platforms like **Netlify**, **Vercel**, or **GitHub Pages** are excellent choices.

    When configuring your deployment, use the following settings:
    -   **Build Command**: `npm run build`
    -   **Publish Directory**: `dist`
