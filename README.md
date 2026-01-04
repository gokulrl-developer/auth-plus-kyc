🧩 MERN Authentication & KYC System
📌 Project Overview

This project is a MERN stack application developed as part of a technical assignment.
It implements registration and login of Authentication flow using JWT access token,IMage/Video capturing and saving for KYC using browser APIs, and a paginated dashboard with search functionality.

The application follows real-world security practices and is fully compatible with desktop and mobile browsers.

✨ Features Implemented
🔐 Authentication

Only Registration and login is done

Directly recieves email/password from user for registration.It has to be reformed with otp verification in real application.

No refresh token implemented.

Token verification middleware used to prevent access the pages which are to be prorected.

🧾 KYC Verification

Image KYC using live camera capture

Video KYC with audio + video recording


📊 Dashboard

Paginated data listing with search functionality

🛠 Tech Stack
Frontend

React 18 (Vite + TypeScript),Tailwind CSS (responsive UI),Axios (API communication),MediaDevices & MediaRecorder APIs,
React Router DOM,Sonner (toast notifications)

Backend

Node.js + Express (TypeScript),MongoDB + Mongoose,bcrypt (password hashing),jsonwebtoken (JWT),Multer (multipart uploads),Cloudinary (media storage),cookie-parser, cors, dotenv

📁 Project Structure
frontend/
├── src/
│   ├── pages/
│   ├── components/
│   ├── constants/
│   ├── context/
│   ├── hooks/
│   ├── services/
│   ├── types/
│   ├── App.tsx
│   └── Main.tsx
│
backend/
├── src/
│   ├── config/
│   ├── constants/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── types/
│   ├── utils/
│   ├── app.ts/
│   └── server.ts

🚀 Installation & Setup
1️⃣ Backend Setup
cd backend
npm install


Create .env file:

MONGO_URI=mongodb connection string
FRONTEND_BASE_URL=frontend url
PORT=port number 
SALT_ROUNDS= 
ACCESS_TOKEN_SECRET=
ACCESS_TOKEN_COOKIE_MAX_AGE= // in ms
ACCESS_TOKEN_EXPIRY= // in ms
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

Run backend:

npm run dev

2️⃣ Frontend Setup
cd frontend
npm install

set up .env file

VITE_API_URL=backend url

npm run dev


👤 Author

Gokul R L
MERN Stack Developer