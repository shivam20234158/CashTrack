# 💰 CashTrack — Personal Finance Tracker

CashTrack is a full-stack personal finance management application that helps users track their income and expenses, manage budgets, and monitor their financial activity through a centralized dashboard.

## ✨ Features

- **🔐 User Authentication** — Register and log in securely using JWT-based authentication.
- **💸 Expense Management** — Record and manage daily expenses.
- **💵 Income Tracking** — Keep track of income transactions in one place.
- **🎯 Budget Management** — Create and manage budgets to stay within spending limits.
- **📊 Financial Dashboard** — View financial summaries and gain an overview of your income and expenses.
- **🔒 Token Management** — Manage authentication tokens with support for Redis-backed token blacklisting.
- **📱 Responsive Interface** — Access the application through a modern web interface.

## 🛠️ Tech Stack

| Category | Technologies |
|---|---|
| Frontend | React, Vite, JavaScript |
| Styling | Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | JSON Web Tokens (JWT) |
| Token Blacklisting | Upstash Redis with in-memory fallback |
| API Communication | Axios |
| Development Tools | Git, GitHub, Nodemon |

## 🏗️ Project Structure

```text
CashTrack/
├── client/                 # React frontend
│   ├── src/
│   │   ├── services/       # API and service functions
│   │   └── ...
│   ├── vite.config.js
│   └── package.json
│
├── server/                 # Express backend
│   ├── config/             # Database configuration
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── ...
│   └── package.json
│
├── .gitignore
└── README.md
```

*The structure above is illustrative; adjust folder names to match the repository.*

## ⚙️ Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) and npm
- [MongoDB Atlas](https://www.mongodb.com/atlas) account or a local MongoDB instance
- [Upstash Redis](https://upstash.com/) account (optional)

### 1. Clone the Repository

```bash
git clone https://github.com/shivam20234158/CashTrack.git
cd CashTrack
```

### 2. Set Up the Backend

```bash
cd server
npm install
```

Create a `.env` file inside the `server` directory:

```env
PORT=5050
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_strong_random_secret

# Optional: Upstash Redis
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

Replace the placeholder values with your own credentials. Do not commit your `.env` file or expose secrets in your repository.

Start the backend:

```bash
npm run dev
```

The backend should run at `http://localhost:5050`.

### 3. Set Up the Frontend

Open a new terminal from the project root:

```bash
cd client
npm install
npm run dev
```

The frontend is configured to run at `http://localhost:5174`. Vite proxies `/api` requests to the backend at `http://localhost:5050`.

Make sure both the frontend and backend are running.

> **Note:** These commands assume your `package.json` files define the indicated scripts and that your frontend folder is named `client`. Adjust them if your repository uses different names.

## 🔌 API Routes

The backend exposes the following API route groups:

| Route | Purpose |
|---|---|
| `/api/auth` | User authentication and registration |
| `/api/expenses` | Expense operations |
| `/api/income` | Income operations |
| `/api/budget` | Budget operations |
| `/api/budgets` | Budget operations, if supported by the configured router |
| `/api/dashboard` | Financial dashboard data |

All API requests should use the appropriate HTTP method and authentication where required.

## 🔐 Environment Variables

| Variable | Description |
|---|---|
| `PORT` | Backend server port |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used for signing JWTs |
| `UPSTASH_REDIS_REST_URL` | Optional Upstash Redis REST URL |
| `UPSTASH_REDIS_REST_TOKEN` | Optional Upstash Redis REST token |

When Redis credentials are unavailable, the application can use its in-memory token-blacklisting fallback. In-memory storage is not persistent across restarts and is not shared between multiple server instances.

## 🚀 Future Improvements

- Advanced spending analytics and visual reports
- Monthly budget alerts and spending insights
- Transaction search and filtering
- Exportable financial reports
- Deployment with a production database and hosting setup

## 👨‍💻 Author

**Shivam Panwar**

- GitHub: [@shivam20234158](https://github.com/shivam20234158)
- Project: [CashTrack](https://github.com/shivam20234158/CashTrack)

---

If you find this project useful, consider giving the repository a ⭐ on GitHub.
