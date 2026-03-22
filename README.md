# Authentication System (Node.js + Express + MongoDB)

A comprehensive backend authentication system demonstrating real-world user authentication patterns, including secure registration, email verification, login protection, and password reset flows.

---

## ✨ Features

- **User Registration** - Create account with validation
- **Email Verification** - Token-based email verification links
- **Secure Login** - JWT-based authentication with protected routes
- **Password Recovery** - Forgot password and reset password flows
- **Security** - Password hashing with bcrypt, JWT tokens, middleware protection
- **Error Handling** - Comprehensive error handling and validation

---

## 🛠️ Tech Stack

| Technology                | Purpose                             |
| ------------------------- | ----------------------------------- |
| **Node.js & Express**     | RESTful API backend                 |
| **MongoDB & Mongoose**    | Database & ORM                      |
| **JWT (JSON Web Tokens)** | Stateless authentication            |
| **bcrypt**                | Secure password hashing             |
| **Nodemailer**            | Email verification & password reset |
| **Postman**               | API testing                         |

---

## 📁 Project Structure

```
├── controllers/
│   └── user.controller.js          # Business logic for user operations
├── middlewares/
│   └── auth.middleware.js          # JWT verification middleware
├── model/
│   └── User.model.js               # MongoDB user schema
├── routes/
│   └── user.routes.js              # API route definitions
├── utils/
│   ├── db.js                       # Database connection
│   ├── email__template.js          # Email HTML templates
│   ├── validation.js               # Input validation logic
│   └── verify.email.js             # Email sending logic
├── index.js                        # Server entry point
├── package.json                    # Dependencies
└── README.md                       # This file
```

---

## 📋 Requirements

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or cloud instance)
- SMTP email credentials 

---

## 🚀 Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-username/auth-system-nodejs.git
cd auth-system-nodejs
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create environment variables

```bash
# Copy the sample file
cp .env.sample .env
```

---

## ⚙️ Configuration

Update `.env` file with your credentials:

```env
PORT=5000
BASE_URL=http://localhost:3000

MONGO_URI=your_mongodb_connection_string

MAILTRAP_HOST=sandbox.smtp.mailtrap.io
MAILTRAP_PORT=2525
MAILTRAP_USERNAME=your_mailtrap_username
MAILTRAP_PASSWORD=your_mailtrap_password
MAILTRAP_SENDER_EMAIL=no-reply@example.com

ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRES_IN=15m

REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRES_IN=7d

ACCESS_TOKEN_MAX_AGE=900000
REFRESH_TOKEN_MAX_AGE=604800000
```

---

## ▶️ Usage

### Start the development server

```bash
npm run dev
```

Server runs at: **http://localhost:5000**

### Test with Postman

- Import API requests into Postman
- Test endpoints with sample data
- Verify email verification flow

---

## 📡 API Endpoints

### User Routes

| Method | Endpoint                     | Description               
| ------ | ---------------------------- | ------------------------- 
| POST   | `/api/users/register`        | Create new user account   
| POST   | `/api/users/login`           | Login and get JWT token   
| POST   | `/api/users/verify-email`    | Verify email with token   
| POST   | `/api/users/forgot-password` | Request password reset    
| POST   | `/api/users/reset-password`  | Reset password with token 
| GET    | `/api/users/profile`         | Get user profile          

_(✅ = Requires JWT token in Authorization header)_

---

## 📚 Key Learnings

- **JWT Authentication** - Implementing token-based authentication for stateless API design
- **Password Security** - Hashing passwords with bcrypt and never storing plain text
- **Email Verification** - Secure token-based email verification flows
- **Middleware Pattern** - Creating authentication middleware to protect routes
- **Error Handling** - Proper validation and error responses
- **Async/Await** - Managing asynchronous operations effectively
- **MVC Architecture** - Organizing code with controllers, routes, and models

---

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues and enhancement requests.

---

**Built as a learning project to understand real-world authentication systems.**
