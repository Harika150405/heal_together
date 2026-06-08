# 🌱 HealTogether

HealTogether is a community-driven mental wellness platform developed as a B.Tech project. The goal of this project is to provide a safe and supportive space where students and individuals can share their thoughts, connect with others facing similar challenges, and access emotional support through community interaction.

## 📖 Project Overview

Mental health and emotional well-being are important aspects of everyday life, especially for students who often face academic pressure, stress, and social challenges. HealTogether aims to bridge this gap by creating an online platform that encourages open conversations, peer support, and community engagement.

This project was built as a full-stack web application using modern web technologies, focusing on scalability, usability, and security.

## ✨ Features

* 🔐 Secure User Authentication
* 🌐 Google Sign-In Integration
* 👤 User Profile Management
* 💬 Community Discussions and Posts
* 🤝 Peer Support Platform
* 📱 Responsive Design for Mobile and Desktop
* 🔒 JWT-Based Authentication
* 📧 Email Notification Support
* ⚡ Fast and Modern User Interface

## 🛠️ Technology Stack

### Frontend

* Next.js
* React.js
* Tailwind CSS
* JavaScript

### Backend

* Node.js
* Express.js

### Database

* MySQL
* Prisma ORM

### Authentication

* JWT Authentication
* Google OAuth

## 📂 Project Structure

```text
HealTogether/
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── public/
│   └── styles/
│
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── prisma/
│   └── server.js
│
└── README.md
```

## 🚀 Installation and Setup

### Clone the Repository

```bash
git clone https://github.com/your-username/healtogether.git
cd healtogether
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Backend Setup

```bash
cd backend
npm install
npx prisma generate
node server.js
```

## 🔑 Environment Variables

Create a `.env` file inside the backend directory and add:

```env
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
SMTP_USER=your_email
SMTP_PASS=your_app_password
GOOGLE_CLIENT_ID=your_google_client_id
```



This project is developed for educational and learning purposes.
