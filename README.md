# GIU Nexus — AI-Powered Career & Talent Platform

> German International University — Software Engineering, Spring 2026
> Milestone 3: React Frontend

---

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Folder Structure](#folder-structure)
- [How to Run Locally](#how-to-run-locally)
- [Environment Variables](#environment-variables)
- [Live URL](#live-url)
- [Contributors](#contributors)

---

## Project Overview

GIU Nexus is a full-stack MERN application that connects students with recruiters through an AI-powered career platform. It supports skill extraction from bios, AI-based job recommendations, and automatic job category classification.

---

## Tech Stack

- **Frontend:** React.js (Vite), React Router v6, Axios, Context API
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Atlas)
- **AI Features:** Hugging Face models (NER, Zero-shot classification, Embeddings)

---

## Folder Structure

```
giu-nexus/
├── client/                  # React frontend
│   ├── public/
│   │   ├── favicon.svg
│   │   └── icons.svg
│   ├── src/
│   │   ├── assets/          # Static assets
│   │   ├── components/      # Reusable UI components
│   │   ├── context/         # AuthContext and global state
│   │   ├── services/        # Axios instance and API calls
│   │   ├── App.css
│   │   ├── App.jsx          # Router setup
│   │   ├── index.css
│   │   └── main.jsx         # Entry point
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── server/                  # Express backend
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── seed.js
│   ├── server.js
│   └── .env                 # Not committed to GitHub
├── .gitignore
├── package.json
└── README.md
```

---

## How to Run Locally

### Prerequisites
- Node.js v18+
- MongoDB Atlas connection string (see Environment Variables)

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/renad006/renad006-giu-nexus-milestone3.git
cd renad006-giu-nexus-milestone3

# 2. Install dependencies for both client and server
npm run install:all

# 3. Seed the database (creates admin account + sample data)
npm run seed

# 4. Start both frontend and backend in development mode
npm run dev
```

The frontend will be available at `http://localhost:5173`
The backend will be available at `http://localhost:5000`

---

## Environment Variables

Create a `.env` file inside the `server/` directory with the following:

```env
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
HUGGINGFACE_API_KEY=your_huggingface_api_key
```

Create a `.env` file inside the `client/` directory with the following:

```env
VITE_API_BASE_URL=http://localhost:5000
```

> Never commit `.env` files to GitHub.

---

## Live URL

<!-- Add after deployment -->
- **Frontend:** _coming soon_
- **Backend API:** _coming soon_

---

## Contributors

- [Renad Hesham](https://github.com/renad006/renad006-giu-nexus-milestone3/commits?author=renad006)
- [Malak Haytham](https://github.com/renad006/renad006-giu-nexus-milestone3/commits?author=malak-haytham)
- [Maya Mohamed](https://github.com/renad006/renad006-giu-nexus-milestone3/commits?author=mayamohamed-16001727)
- [Nourhan Zahran](https://github.com/renad006/renad006-giu-nexus-milestone3/commits?author=nourhan-zahran)
- [Malak El Sadek](https://github.com/renad006/renad006-giu-nexus-milestone3/commits?author=malakelsadek)
- [Suha Mohamed](https://github.com/renad006/renad006-giu-nexus-milestone3/commits?author=SuhaMohamedElguindy)
- [Mohamed Ahmed](https://github.com/renad006/renad006-giu-nexus-milestone3/commits?author=MeedoAhmedd)
- [Arwa Ismail](https://github.com/renad006/renad006-giu-nexus-milestone3/commits?author=ARwa-Ismail)