# Library Management System

## Overview
This project is a full-stack web application built with **React** for the frontend and **Node.js** for the backend. The project structure is organized into two main folders: `frontend` and `backend`.

## Getting Started

### Prerequisites
- **Node.js** (v14.x or higher)
- **npm** (v6.x or higher)
- **MongoDB** (if using a database)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/shailthakkar/lms.git
   cd library-management-system
    
2. **Install dependencies for the frontend:**
   ```bash
   cd frontend
   npm install
   
3. **Install dependencies for the backend:**
   ```bash
   cd backend
   npm install

### Running the Project
1. **Start the backend server:**
   ```bash
   cd backend
   npm start
   The backend server will start on http://localhost:4000 (or the port specified in your environment variables).

2. **Start the frontend server:**
   ```bash
   cd frontend
   npm start
   The React app will start on http://localhost:3000.

### Available Scripts

1. **Frontend**
   ```bash
   npm start: Starts the development server.
   npm build: Builds the app for production.
   npm test: Runs the test suite.
2. **Backend**
   ```bash
   npm start: Starts the Node.js server.
   npm run dev: Starts the server in development mode with hot-reloading.

### Login Credentials
1. **Guest User:**
   ```bash
   Username: guest
   Password: guest

2. **Admin User:**
   ```bash
   Username: admin
   Password: admin

### Backend .env file:
  ```bash
PORT=your-port
DB_URI=mongodb://localhost:27017/your-database-name
JWT_SECRET=your_jwt_secret
