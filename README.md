# Menzu - Premium E-Commerce Platform

A fully-featured, full-stack E-Commerce web application built with the MERN stack. Designed with premium dark-mode aesthetics, glassmorphism UI elements, and seamless checkout integrations. 

Live Demo: [https://menzu-olive.vercel.app](https://menzu-olive.vercel.app)

## 🚀 Key Features

- **Modern UI/UX:** Premium dark mode styling with subtle animations and bento-grid layouts using Tailwind CSS.
- **Secure Authentication:** Integrated **Google OAuth 2.0** for one-click user sign-ups and secure session handling.
- **Dynamic Cart System:** Real-time adding, updating, and removing items synced instantly with the MongoDB backend.
- **Real Transactions:** Integrated **Razorpay** payment gateway for processing real checkout sessions dynamically in INR (₹).
- **Order Tracking:** Real-time visual timeline showing dynamic order status (`Ordered` -> `Shipped` -> `Transit` -> `Delivered`).
- **Product Filtering:** Fetching dynamic products from the backend with related-product suggestion logic.
- **Monorepo Architecture:** Clean separation of concerns with independent Vercel and Render deployments.

## 🛠 Tech Stack

### Frontend (Client)
- **Framework:** React 18 (Bootstrapped with Vite)
- **Styling:** Tailwind CSS
- **Routing:** React Router DOM
- **State Management:** Custom React Context API (`GlobalState.jsx`)
- **Icons & Fonts:** Google Material Symbols & Material UI

### Backend (Server)
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (via Mongoose ODMs)
- **CORS & Parsing:** `cors` and native `express.json()` middlewares

### External Integrations & APIs
- **Google Cloud Console:** OAuth 2.0 authentication integration.
- **Razorpay:** Payment processing and order creation.
- **Cloud Hosting:** Vercel (Frontend edge network) and Render.com (Backend API cluster).

---

## 💻 Getting Started (Local Development)

### Prerequisites
- Node.js (v18+)
- Local MongoDB instance or MongoDB Atlas URI

### 1. Backend Setup
1. Open a terminal and navigate to the `backend` directory.
2. Install dependencies:
   ```bash
   cd backend
   npm install
   ```
3. Create a `.env` file containing your secrets:
   ```env
   PORT=5001
   MONGO_URI=your_mongodb_cluster_string
   RAZORPAY_KEY_ID=your_razorpay_test_key
   RAZORPAY_KEY_SECRET=your_razorpay_secret
   FRONTEND_URL=http://localhost:5173
   GOOGLE_CLIENT_ID=your_google_client_id
   ```
4. Start the development server:
   ```bash
   node server.js
   ```

### 2. Frontend Setup
1. Open a second terminal and navigate to the `frontend` directory.
2. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
3. Create a `.env` file:
   ```env
   VITE_RAZORPAY_KEY_ID=your_razorpay_test_key
   VITE_GOOGLE_CLIENT_ID=your_google_client_id
   # Only needed for local dev if backend is on a different port
   # VITE_API_URL=http://localhost:5001 
   ```
4. Start the Vite dev server:
   ```bash
   npm run dev
   ```

## 🏗 Deployment Architecture
Menzu is deployed via a decoupled cloud architecture:
- **Client (Vercel):** The `frontend/` directory is deployed to Vercel perfectly routing dynamically to the backend API via environment variables.
- **API (Render):** The `backend/` directory is independently hosted on Render.com, securely managing the database state and API traffic.

## 🤝 Project Origin
This application was entirely pair-programmed leveraging the Google DeepMind agentic AI coding framework (Antigravity), transitioning a raw UI concept directly into a cloud-ready, full-stack application logic.
