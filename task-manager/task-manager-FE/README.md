---

##  Frontend (React + Vite) `README.md`

```markdown
# Task Manager Frontend (React + Vite)

A responsive, intuitive frontend built with **React**, **Vite**, and **Tailwind CSS**, consuming the Laravel Task Manager API via **Axios** and managing auth via **Context API**.

---

## Features

-   **Login** / **Register** flows
-   **Tasks Dashboard** with filters (Status, Priority)
-   **Create**, **Edit**, **Toggle Complete**, **Reassign Tasks**
-   Dynamic status display (Done, Missed/Late, Due Today, Upcoming)
-   Form validation and inline error handling
-   Reassign modal for quick task assignment
-   Tailwind CSS for clean, responsive design

---

## Tech Stack

-   **React 18**, **Vite**
-   **Tailwind CSS**
-   **React Router v6**
-   **Context API** for auth
-   **Axios** for API calls
-   Optional: **react-datepicker** for date input

---

## Setup & Run

### Prerequisites

-   Node.js and npm/yarn installed

### Setup

```bash
git clone <repo-url>
cd frontend
npm install
cp .env.example .env
# Set VITE_API_BASE_URL to your Laravel API base URL
npm run dev
```
