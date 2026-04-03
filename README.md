# 💰 Finance Dashboard API

A RESTful backend API for managing personal financial records with role-based access control and dashboard analytics.

## 🛠 Tech Stack
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- express-validator

## ⚙️ Setup

1. Clone the repo and install dependencies:
```bash
npm install
```

2. Create a `.env` file:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/finance_dashboard
JWT_SECRET=your_secret_key
```

3. Start the server:
```bash
npm run dev
```

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | /api/auth/register | Public | Register new user |
| POST | /api/auth/login | Public | Login and get token |

### Users
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | /api/users/me | All | Get own profile |
| GET | /api/users/all | Admin | Get all users |
| DELETE | /api/users/:id | Admin | Delete a user |

### Records
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | /api/records | Analyst, Admin | Create record |
| GET | /api/records | All | Get records (with filters) |
| GET | /api/records/:id | Owner, Admin | Get single record |
| PUT | /api/records/:id | Owner, Admin | Update record |
| DELETE | /api/records/:id | Owner, Admin | Delete record |

### Dashboard
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | /api/dashboard/summary | All | Income, expense, balance |
| GET | /api/dashboard/by-category | All | Category-wise totals |
| GET | /api/dashboard/monthly-trends | All | Month-wise trends |

---

## 🔍 Query Parameters — GET /api/records

| Param | Example | Description |
|-------|---------|-------------|
| type | ?type=income | Filter by income or expense |
| category | ?category=food | Filter by category |
| search | ?search=rent | Search in category + note |
| startDate | ?startDate=2024-01-01 | From date |
| endDate | ?endDate=2024-12-31 | To date |
| page | ?page=2 | Page number |
| limit | ?limit=5 | Results per page |

---

## 📦 Sample Requests

### Register
```json
POST /api/auth/register
{
  "name": "Alice",
  "email": "alice@example.com",
  "password": "pass123",
  "role": "admin"
}
```

### Create Record
```json
POST /api/records
Authorization: Bearer <token>
{
  "amount": 5000,
  "type": "income",
  "category": "salary",
  "date": "2024-03-01",
  "note": "March salary"
}
```

### Get Records with Filters + Pagination
```
GET /api/records?type=expense&search=food&page=1&limit=5
Authorization: Bearer <token>
```

### Dashboard Summary Response
```json
{
  "totalIncome": 15000,
  "totalExpense": 8500,
  "netBalance": 6500
}
```

### Monthly Trends Response
```json
{
  "data": [
    { "month": "2024-01", "income": 5000, "expense": 2000 },
    { "month": "2024-02", "income": 5000, "expense": 3500 }
  ]
}
```