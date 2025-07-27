# Mystery Message 
## Overview
The Mystery Message App is a secure and anonymous messaging platform built with Next.js. This app allows users to send anonymous messages to anyone without sharing their personal details. It utilizes advanced features to ensure user privacy and message integrity, including unique usernames, unique message IDs for message deletion, JSON Web Tokens (JWT) for authentication, and OTP-based verification through Resend Mail.

# Features
## Anonymous Messaging
1. Send Anonymous Messages: Users can send messages anonymously without revealing their identity.
2. No Personal Details Required: No need to share personal information to send or receive messages.

## User Authentication and Verification
1. JSON Web Tokens (JWT): Secure authentication using JWT ensures that user sessions are safe and protected.
2. OTP-Based Verification: An additional layer of security with OTP verification sent via email using Resend Mail.
## Unique Identifiers
1. Unique Usernames: Each user is assigned a unique username to maintain anonymity.
2. Unique Message IDs: Messages are assigned unique IDs, allowing users to delete specific messages if needed.

## Security and Privacy
1. Encryption: All passwords are encrypted to ensure that only the intended recipient can read them
2. Secure Data Handling: User data and messages are securely handled and stored.


# Getting Started
## Prerequisites
1. Node.js installed on your system
2. A Next.js development environment set up

## Installation
Clone the repository:
git clone https://github.com/yourusername/mystery-message-app.git
cd mystery-message-app

## Install dependencies:

npm install
Set up environment variables:
Create a .env.local file in the root directory and add the following:


## Copy code
JWT_SECRET=your_jwt_secret
RESEND_API_KEY=your_resend_mail_api_key
NEXT_PUBLIC_API_URL=http://localhost:3000/api
Start the development server:

## run command
npm run dev
Open your browser and navigate to:
http://localhost:3000

# Usage
## Sending a Message
1. Register or log in using your unique username.
2. Verify your email with the OTP sent via Resend Mail.
3. Compose your message and send it anonymously.


## Deleting a Message
1. Log in to your account.
2. Delete the message by selecting the message and press delete.


## Technologies Used
1. Next.js: Framework for server-rendered React applications.
2. Next.js: Backend server runtime.
3. JWT: For secure user authentication.
4. Resend Mail: For sending OTPs for email verification.
5. MongoDB: Database for storing user and message data.
   
# Contributing
We welcome contributions from the community. To contribute, please follow these steps:

1. Fork the repository.
2. Create a new branch:

3. git checkout -b feature/your-feature-name
4. Make your changes and commit them:

5. git commit -m "Add feature: description of your feature"
6. Push to the branch:

7. git push origin feature/your-feature-name
8. Open a pull request.
