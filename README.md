# 🚀 CMS Server

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-5.1.0-lightgrey.svg)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0+-blue.svg)](https://www.mysql.com/)
[![Swagger](https://img.shields.io/badge/Swagger-2.0-orange.svg)](https://swagger.io/)

A robust and scalable Content Management System (CMS) API server built with Node.js, Express.js, and MySQL. This project provides a complete backend solution for managing users, posts, comments, likes, and follow relationships, with built-in authentication and comprehensive API documentation.

## 📋 Table of Contents

- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [📦 Installation](#-installation)
- [🚀 Usage](#-usage)
- [📚 API Documentation](#-api-documentation)
- [🏗️ Project Structure](#️-project-structure)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [👤 Author](#-author)

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔐 **Authentication** | JWT-based user authentication with registration and login |
| 👥 **User Management** | Complete CRUD operations for user profiles |
| 📝 **Post Management** | Create, read, update, delete posts with categories and tags |
| 💬 **Comments System** | Full commenting functionality on posts |
| ❤️ **Likes System** | Like and unlike posts with tracking |
| 👫 **Follow System** | User following and follower management |
| 📖 **Swagger API Docs** | Interactive API documentation |
| 🔒 **Security** | Helmet for security headers, CORS support |
| 📊 **Pagination** | Built-in pagination for large datasets |
| 🏷️ **Categories & Tags** | Organize posts with categories and tags |
| 📝 **Draft & Archive** | Support for draft and archived posts |

## 🛠️ Tech Stack

| Component | Technology |
|-----------|------------|
| **Runtime** | Node.js |
| **Framework** | Express.js |
| **Database** | MySQL |
| **ORM** | Sequelize |
| **Authentication** | JSON Web Tokens (JWT) |
| **Validation** | Joi |
| **Security** | Helmet, bcrypt |
| **Documentation** | Swagger UI |
| **Development** | Nodemon, ESLint, Prettier |

## 📦 Installation

### Prerequisites

- Node.js (v18 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/OracleMatrix/cms_server.git
   cd cms_server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   - Create a `.env` file in the root directory
   - Add your environment variables:
     ```env
     NODE_ENV=development
     PORT=3000
     DB_HOST=127.0.0.1
     DB_USER=root
     DB_PASSWORD=your_password
     DB_NAME=cms_database_dev
     JWT_SECRET=your_jwt_secret
     ```

4. **Database Setup**
   - Create a MySQL database named `cms_database_dev`
   - Run migrations:
     ```bash
     npx sequelize-cli db:migrate
     ```

5. **Generate Swagger Documentation**
   ```bash
   npm run swagger
   ```

## 🚀 Usage

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:3000` (or your configured PORT).

### API Base URL
```
http://localhost:3000/api/v1
```

## 📚 API Documentation

Access the interactive API documentation at:
```
http://localhost:3000/api-docs/
```

### Main Endpoints

| Module | Base Path | Description |
|--------|-----------|-------------|
| 🔐 Auth | `/auth` | User registration and login |
| 👥 Users | `/users` | User management operations |
| 📝 Posts | `/posts` | Post CRUD and queries |
| 💬 Comments | `/comments` | Comment management |
| ❤️ Likes | `/like`, `/unlike` | Like/unlike operations |
| 👫 Follow | `/follow` | Follow/unfollow users |

### Authentication
Most endpoints require authentication. Include the JWT token in the `Authorization` header:
```
Authorization: your_jwt_token_here
```

## 🏗️ Project Structure

```
cms_server/
├── src/
│   ├── config/          # Database configuration
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Custom middleware (auth, etc.)
│   ├── migrations/      # Database migrations
│   ├── models/          # Sequelize models
│   ├── routes/          # API routes
│   ├── services/        # Business logic services
│   ├── seeds/           # Database seeds
│   ├── swagger.js       # Swagger configuration
│   ├── swagger-output.json # Generated API docs
│   └── index.js         # Application entry point
├── .env                 # Environment variables
├── .gitignore           # Git ignore rules
├── package.json         # Dependencies and scripts
└── README.md            # Project documentation
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

### Development Guidelines

- Follow ESLint and Prettier configurations
- Write tests for new features
- Update Swagger documentation for API changes
- Use conventional commit messages

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Ehsan Mohammadipoor**

- GitHub: [@OracleMatrix](https://github.com/OracleMatrix)
- Repository: [https://github.com/OracleMatrix/cms_server](https://github.com/OracleMatrix/cms_server)

---

⭐ If you found this project helpful, please give it a star!

---

*Built with ❤️ using Node.js and Express.js*
