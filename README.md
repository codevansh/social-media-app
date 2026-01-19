# Social Media App

A full-stack social media web application built with **MERN (MongoDB, Express, React, Node.js)** that enables users to create accounts, post content, interact with other users, and engage in real-time communication.

Live Demo: https://social-media-app-server-omega.vercel.app

## Table of Contents

- [About](#about)  
- [Tech Stack](#tech-stack)  
- [Features](#features)  
- [Project Structure](#project-structure)  
- [Getting Started](#getting-started)  
  - [Prerequisites](#prerequisites)  
  - [Installation](#installation)  
  - [Environment Variables](#environment-variables)  
  - [Running the App](#running-the-app)  
- [API Endpoints](#api-endpoints)  
- [Contributing](#contributing)  
- [License](#license)

## About

This project is a social media platform where users can sign up, log in, create posts, like or comment on posts, follow other users, and chat in real time. It demonstrates a scalable, modular architecture using React for the frontend and Node.js/Express for the backend.

## Tech Stack

### Frontend
- React  
- React Router  
- Context API / Redux *(based on implementation)*  
- CSS / Tailwind / Chakra UI *(based on implementation)*  

### Backend
- Node.js  
- Express.js  
- MongoDB (Mongoose)  
- JWT Authentication  
- Bcrypt for Password Hashing  
- Socket.io for real-time chat *(if implemented)*  

## Features

- User Registration & Login with JWT Authentication  
- Secure Password Hashing & Validation  
- Create, Read, Update & Delete Posts  
- Like and Comment on Posts  
- Follow and Unfollow Users  
- Profile Management  
- Real-Time Messaging *(if using socket.io)*  
- Responsive UI  

#Project Structure

social-media-app/
├── client/ # React frontend
│ ├── public/
│ └── src/
├── server/ # Backend API
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ └── utils/
├── .gitignore
├── package.json
└── README.md

### Installation

1. Clone the repository:
   git clone https://github.com/codevansh/social-media-app.git
   cd social-media-app
2. Install dependencies for both client and server:
  # in project root
  cd client
    npm install
  cd ../server
    npm install


## Create a .env file in the server directory with the following
  MONGO_URI=your_mongodb_connection_string
  JWT_SECRET=your_jwt_secret
  CLIENT_URL=http://localhost:3000
  PORT=5000


## Running the App
  Start backend server:
    cd server
    npm run dev

  Start frontend:
    cd ../client
    npm start


Your application should now be running:
* Frontend → http://localhost:3000
* Backend API → http://localhost:5000

Author: Vansh Mehta (Completed Social Media Project on GreatStack) 
Project Link: https://github.com/codevansh/social-media-app
## Project Structure

