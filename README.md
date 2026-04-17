n# 🛒 Flipkart Clone - Full Stack App

React + Node.js + MongoDB + Razorpay payment integration

---

## 📁 Project Structure

```
flipkart-clone/
├── backend/          ← Node.js + Express API
│   ├── config/db.js       ← MongoDB connection
│   ├── models/            ← User, Product, Order schemas
│   ├── routes/            ← auth, products, orders, payment
│   ├── middleware/auth.js ← JWT middleware
│   ├── server.js          ← Main server
│   ├── seedData.js        ← Sample data seeder
│   └── .env.example       ← Env variables template
└── frontend/         ← React app
    ├── src/
    │   ├── components/    ← Navbar, ProductCard
    │   ├── context/       ← Auth + Cart context
    │   ├── pages/         ← All pages
    │   └── utils/api.js   ← Axios API calls
    └── .env.example
```

---

## 🚀 Step-by-Step Setup Guide

### ✅ STEP 1: Prerequisites Install Karein

```bash
# Node.js install karein (v18+): https://nodejs.org
node --version   # v18+ hona chahiye

# MongoDB install karein: https://www.mongodb.com/try/download/community
# Ya MongoDB Atlas (free cloud): https://cloud.mongodb.com
```

---

### ✅ STEP 2: Project Download & Extract Karein

ZIP file extract karein, fir terminal/cmd mein jaayein:

```bash
cd flipkart-clone
```

---

### ✅ STEP 3: MongoDB Connect Karna

**Option A: Local MongoDB (Computer pe)**
```
MONGO_URI=mongodb://localhost:27017/flipkart_clone
```
MongoDB service start karein pehle:
- Windows: Services → MongoDB → Start
- Mac/Linux: `sudo systemctl start mongod`

**Option B: MongoDB Atlas (Cloud - Recommended)**
1. https://cloud.mongodb.com par free account banayein
2. New Cluster banayein (M0 Free tier)
3. Database User banayein (username + password)
4. Network Access → Add IP → "Allow Access from Anywhere" (0.0.0.0/0)
5. Connect → Drivers → Connection String copy karein:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/flipkart_clone
   ```

---

### ✅ STEP 4: Razorpay Account Banana

1. https://razorpay.com → Sign Up (FREE test account)
2. Dashboard → Settings → API Keys
3. "Generate Test Key" click karein
4. KEY_ID aur KEY_SECRET copy karein

---

### ✅ STEP 5: Backend Setup

```bash
cd backend

# .env file banayein
# Windows:
copy .env.example .env
# Mac/Linux:
cp .env.example .env
```

**.env file edit karein:**
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/flipkart_clone
JWT_SECRET=mera_super_secret_key_123456
JWT_EXPIRE=7d
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxx
FRONTEND_URL=http://localhost:3000
```

```bash
# Dependencies install karein
npm install

# Sample data seed karein (products + admin user)
node seedData.js

# Server start karein
npm run dev
```

Server chalega: http://localhost:5000
Test karein: http://localhost:5000 (browser mein kholo)

---

### ✅ STEP 6: Frontend Setup

```bash
# New terminal mein
cd frontend

# .env file banayein
# Windows:
copy .env.example .env
# Mac/Linux:
cp .env.example .env
```

**.env file edit karein:**
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
```

```bash
# Dependencies install karein
npm install

# React app start karein
npm start
```

Browser mein khulega: http://localhost:3000

---

## 🧪 Test Users (Seed ke baad)

| Role  | Email                 | Password  |
|-------|-----------------------|-----------|
| Admin | admin@flipkart.com    | admin123  |
| User  | khud register karein  | -         |

---

## 📡 API Endpoints

### Auth
| Method | Endpoint            | Description       | Auth |
|--------|---------------------|-------------------|------|
| POST   | /api/auth/register  | Register          | No   |
| POST   | /api/auth/login     | Login             | No   |
| GET    | /api/auth/me        | Current user      | Yes  |
| PUT    | /api/auth/profile   | Update profile    | Yes  |

### Products
| Method | Endpoint                    | Description         | Auth  |
|--------|-----------------------------|---------------------|-------|
| GET    | /api/products               | All products        | No    |
| GET    | /api/products?keyword=phone | Search              | No    |
| GET    | /api/products?category=Electronics | Filter      | No    |
| GET    | /api/products/:id           | Single product      | No    |
| POST   | /api/products               | Create product      | Admin |
| PUT    | /api/products/:id           | Update product      | Admin |
| DELETE | /api/products/:id           | Delete product      | Admin |
| POST   | /api/products/:id/review    | Add review          | Yes   |

### Orders
| Method | Endpoint             | Description       | Auth  |
|--------|----------------------|-------------------|-------|
| POST   | /api/orders          | Create order      | Yes   |
| GET    | /api/orders/my       | My orders         | Yes   |
| GET    | /api/orders/:id      | Order detail      | Yes   |
| PUT    | /api/orders/:id/cancel | Cancel order    | Yes   |
| GET    | /api/orders          | All orders        | Admin |
| PUT    | /api/orders/:id/status | Update status   | Admin |

### Payment
| Method | Endpoint                    | Description          | Auth |
|--------|-----------------------------|----------------------|------|
| POST   | /api/payment/create-order   | Create Razorpay order| Yes  |
| POST   | /api/payment/verify         | Verify payment       | Yes  |

---

## 💳 Razorpay Test Cards

| Card Number         | CVV  | Expiry  |
|---------------------|------|---------|
| 4111 1111 1111 1111 | Any  | Any future date |
| 5267 3181 8797 5449 | Any  | Any future date |

**UPI Test ID:** success@razorpay

---

## 🔧 Common Problems & Solutions

**MongoDB connection error:**
- MongoDB service chal raha hai? `sudo systemctl start mongod`
- Atlas use kar rahe ho? IP whitelist check karo

**npm install fail:**
- Node.js version 18+ hona chahiye
- `npm cache clean --force` try karo

**CORS error:**
- backend .env mein FRONTEND_URL=http://localhost:3000 set karo

**Razorpay not working:**
- KEY_ID aur KEY_SECRET dono .env mein daalein
- Test mode key use karo (rzp_test_ se shuru)

---

## 🏗️ Features

- ✅ User Register/Login (JWT)
- ✅ Product listing, search, filter, pagination
- ✅ Product detail with reviews
- ✅ Shopping cart (localStorage)
- ✅ Razorpay payment integration
- ✅ Order management
- ✅ Order tracking (Processing → Shipped → Delivered)
- ✅ Profile management
- ✅ Admin product management
- ✅ Mobile responsive design
- ✅ Sample data seeder
