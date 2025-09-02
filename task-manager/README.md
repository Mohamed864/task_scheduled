# Task Manager API (Laravel)

A secure and modular Task Management backend built with **Laravel 12** and Sanctum. It supports user registration, authentication, task creation, assignment, and CRUD with robust permission controls.

---

## Features

-   JWT-like token-based authentication using **Laravel Sanctum**
-   User registration & secure login/logout
-   Task CRUD operations with fields:
    -   Title, Description, Due Date, Priority, Creator, Assignee, Completed Status
-   Dynamic task statuses:
    -   **Done**, **Missed/Late**, **Due Today**, **Upcoming**
-   Task visibility and permissions:
    -   Only assignees can view/edit tasks
    -   Creators can reassign or delete tasks they created
-   Error handling for validation, auth, and logical flows

---

## Tech Stack

-   **Laravel 12**
-   **Laravel Sanctum** for API auth
-   **MySQL / PostgreSQL** (via Eloquent)
-   **PHPUnit** for backend testing

---

## Getting Started

### Prerequisites

-   PHP 8.2+, Composer
-   Node.js (for optional frontend build)
-   Database setup (MySQL/PostgreSQL)

### Setup

```bash
git clone <repo-url>
cd backend
composer install
cp .env.example .env
php artisan key:generate
# Configure DB settings in .env
php artisan migrate
php artisan serve
php artisan test
```
