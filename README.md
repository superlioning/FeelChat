# FeelChat

FeelChat is a real-time web-based chat application that integrates sentiment analysis to enhance communication by providing instant emotional insights during conversations.

## Team Members (Team 1 COMP313-002 F2024)
- Ninghua Zhang
- Wenjie Zhou
- Kuldeep Brar
- Varenyam Bhatt
- Olaoluwa Ajakaiye

## Description
FeelChat aims to improve digital communication by addressing the common problem of emotionally uninformed interactions, which can lead to misunderstandings—especially in customer service and community management contexts. The app leverages Next.js for frontend development, Node.js for backend services, Pusher for real-time messaging, and the Sentiment NPM package for real-time sentiment analysis. Messages are categorized as positive, neutral, or negative, with visual feedback provided through color-coded indicators or emojis to help users understand the tone of conversations.

## Deployment
- Deployed on Vercel [https://feel-chat-seven.vercel.app/](https://feel-chat-seven.vercel.app/)

## Features
- **Real-time Messaging**: Seamless, live chat functionality.
- **Web-Based Interface**: Accessible from any device with a browser.
- **Sentiment Analysis**: Real-time sentiment detection to provide insights into message tone.

## Tech Stack
- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Pusher](https://pusher.com/)
- [Sentiment NPM](https://www.npmjs.com/package/sentiment)

## Installation & Setup
1. Clone the repository:
    ```bash
    git clone https://github.com/superlioning/comp313-002-Team-1-F24-FeelChat.git
    ```

2. Install the required packages:
    ```bash
    npm install
    ```

3. Create a `.env.local` file in the root directory and add the following environment variables:
    ```plaintext
    # Server environment variables
    PUSHER_SECRET
    PUSHER_APP_ID
    MONGODB_URI
    JWT_SECRET

    # Client environment variables
    NEXT_PUBLIC_PUSHER_KEY
    NEXT_PUBLIC_PUSHER_CLUSTER
    NEXT_PUBLIC_ADMIN_VERIFICATION_CODE
    NEXT_PUBLIC_CUSTOMER_SUPPORT_VERIFICATION_CODE
    ```

## Running the Application
1. Start the development server:
    ```bash
    npm run dev
    ```

2. Open the application in your web browser:
    ```plaintext
    http://localhost:3000
    ```

## API Endpoints
- **POST** `/api/auth/login` - Authenticates a user and returns a JWT token.
- **POST** `/api/auth/signup` - Registers a new user.
- **POST** `/api/auth/logout` - Logs out the user.
- **POST** `/api/messages` - Sends a new message.
- **POST** `/api/profile` - Updates user profile.
- **GET** `/api/statistics` - Fetches statistics data.
- **GET** `/api/admin/userCounts` - Fetches user counts for each role.
- **GET** `/api/admin/users` - Fetches all users except admins.
- **DELETE** `/api/admin/users` - Deletes a user by ID.

## Usage
1. Open the application in your web browser.
2. Sign up or log in to your account.
3. Start a chat and see real-time sentiment analysis of your messages.
4. Admins can access all pages and manage user accounts.

## Frontend
The frontend is built using Next.js and includes a real-time chat interface with sentiment analysis indicators.