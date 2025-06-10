# DSA Platform Backend

A robust backend for a Data Structures and Algorithms (DSA) learning platform, enabling users to track progress, solve problems, and manage topics.

## Features

*   **User Authentication:** Secure registration and login using JSON Web Tokens (JWT).
*   **Problem Tracking:** Mark problems as solved, update progress, and view solved problems.
*   **Topic Management:** Organize problems by topics.
*   **User Progress Dashboard:** Comprehensive statistics including total problems, solved problems, completion rate, daily progress over the last 30 days, and problems solved by difficulty.
*   **Recent Solved Problems:** View recently solved problems with details.

## Technologies Used

*   **Node.js:** JavaScript runtime environment.
*   **Express.js:** Fast, unopinionated, minimalist web framework for Node.js.
*   **MongoDB:** NoSQL database for flexible data storage.
*   **Mongoose:** MongoDB object data modeling (ODM) for Node.js.
*   **JSON Web Tokens (JWT):** For secure user authentication.

## Installation Guide

Follow these steps to get the project up and running on your local machine.

### Prerequisites

Before you begin, ensure you have the following installed:

*   **Node.js:** [Download & Install Node.js](https://nodejs.org/en/download/) (includes npm)
*   **npm:** Node Package Manager (comes with Node.js)
*   **MongoDB:** [Install MongoDB](https://docs.mongodb.com/manual/installation/)

### Steps

1.  **Clone the repository:**
    ```bash
    git clone [[<repository_url>]()](https://github.com/amarprajapati571/codingplatform-backend.git)
    cd codingplatform-backend
    ```
    (Replace `[<repository_url>](https://github.com/amarprajapati571/codingplatform-backend.git)` with the actual URL of your repository.)

2.  **Install dependencies:**
    Navigate to the project root directory and install all required Node.js packages:
    ```bash
    npm install
    npm run seed (For pre database records storing)
    ```

3.  **Set up Environment Variables:**
    Create a `.env` file in the root directory of the project and add the following environment variables:

    ```
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret_key
    ```
    *   `MONGO_URI`: Your MongoDB connection string (e.g., `mongodb://localhost:27017/dsa-platform` or a MongoDB Atlas URI).
    *   `JWT_SECRET`: A strong, random string used for signing JWT tokens.

4.  **Run the application:**
    Start the Node.js server:
    ```bash
    npm start
    ```
    The server should now be running, typically on `http://localhost:5000` (or whatever port is configured in your `server.js` or `app.js`).

## API Endpoints

The API is structured to provide various functionalities for the DSA platform.

### Authentication (`/api/auth`)

*   `POST /api/auth/register`: Register a new user.
*   `POST /api/auth/login`: Log in an existing user and receive a JWT.

### Progress & Profile (`/api/progress`)

*   `POST /api/progress/solve`: Mark a problem as solved for the authenticated user.
*   `GET /api/progress/questions`: Retrieve all topics and the authenticated user's progress for each.
*   `PUT /api/progress/update`: Update a user's progress for a specific problem (e.g., mark as completed/uncompleted).
*   `GET /api/progress/summary`: Get a summary of the authenticated user's profile data, including total/solved problems, completion rate, daily progress, and problems by difficulty.

## Usage

Once the backend is running, you can interact with it using tools like Postman, Insomnia, or integrate it with a frontend application.

Remember to include the JWT in the `Authorization` header as a Bearer token for protected routes.
