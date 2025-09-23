#  Jungle Gem Organizer

A fun, jungle-themed to-do list application to help you organize your tasks (or "gems"!).

## Features

*   **Task Management:** Add, complete, and delete tasks.
*   **Categorization:** Organize tasks into "Personal", "Work", and "Ideas" tabs.
*   **Visual Feedback:** Enjoy a satisfying confetti burst when you complete a task.
*   **Persistent Storage:** Your tasks are saved in your browser's local storage, so they'll be there when you come back.
*   **Import/Export:** Save your tasks to a JSON file or import them into the application.
*   **Themed UI:** A beautiful jungle-themed interface.

## Tech Stack

*   **Frontend:** React, Vite, Tailwind CSS
*   **Backend:** Node.js, Express
*   **Monorepo Management:** npm Workspaces

## Getting Started

### Prerequisites

*   Node.js (v18 or higher recommended)
*   npm (v7 or higher recommended)

### Installation and Running the App

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd dauters-game
    ```

2.  **Install dependencies:**
    This will install dependencies for both the client and server.
    ```bash
    npm install
    ```

3.  **Run the development server:**
    This will start both the frontend (on http://localhost:5173) and the backend (on http://localhost:5174) concurrently.
    ```bash
    npm run dev
    ```

4.  **Open your browser** and navigate to `http://localhost:5173` to see the application.

## Available Scripts

*   `npm run dev`: Starts both the client and server in development mode.
*   `npm run build`: Builds both the client and server for production.
*   `npm run start`: Starts the production server.
