# ExpenseAI – Advanced Expense Tracker

**A Full-Stack Expense Management Platform built with Next.js, TypeScript, Node.js, Express.js, PostgreSQL, and Redis.**

[Live Demo](https://expense-ai-advanced-clean.vercel.app) • [Backend API](https://expenseai-advanced-clean.onrender.com) • [GitHub Repository](https://github.com/PushpakGanganmale/ExpenseAI-Advanced-Clean)

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-Frontend-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript)
![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?logo=node.js)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?logo=postgresql)
![Redis](https://img.shields.io/badge/Redis-Caching-DC382D?logo=redis)
![Docker](https://img.shields.io/badge/Docker-Containerization-2496ED?logo=docker)

---

## Overview

ExpenseAI is a full-stack financial management application designed to help users track expenses, manage budgets, monitor recurring transactions, and understand their spending patterns.

The application provides an interactive dashboard with financial summaries, expense management, budget tracking, analytics, and data import/export capabilities.

It combines a modern Next.js frontend with a Node.js and Express backend, PostgreSQL for persistent storage, and Redis for caching infrastructure.

## Live Deployment

| Component | Deployment |
|---|---|
| Frontend | [Vercel](https://expense-ai-advanced-clean.vercel.app) |
| Backend | [Render](https://expenseai-advanced-clean.onrender.com) |
| Backend Health | [Health Check](https://expenseai-advanced-clean.onrender.com/health) |
| GitHub | [Source Code](https://github.com/PushpakGanganmale/ExpenseAI-Advanced-Clean) |

## Features

### 1. Authentication & User Management
- User registration and login.
- JWT-based authentication.
- Authenticated dashboard access.
- User-specific financial data.
- Google OAuth integration and callback configuration.
- Secure password handling on the backend.

### 2. Expense Management
- Add new expenses.
- Update existing transactions.
- Delete expenses.
- View transaction history.
- Manage personal financial records.
- Paginated expense data.

### 3. Financial Dashboard
- Interactive dashboard.
- Total income and expense summaries.
- Financial statistics.
- Spending visualizations.
- Category-wise expense breakdown.
- Monthly financial analytics.

### 4. Budget Management
- Create category-based budgets.
- Track budget allocation.
- Monitor spending against budget limits.
- Display budget progress.
- Budget management dashboard.

### 5. Recurring Expenses
- Add recurring transactions.
- Manage recurring expense records.
- Track scheduled financial commitments.

### 6. Data Import & Export
- CSV expense import.
- PDF import support.
- CSV expense export.
- Transaction data management.

### 7. Receipt OCR Development
- Backend receipt-processing implementation.
- OCR-related controller, route, and service integration.
- Receipt data extraction workflow development.

### 8. Backend & Infrastructure
- REST API architecture.
- PostgreSQL database integration.
- Sequelize ORM.
- Redis integration.
- Docker Compose development environment.
- Environment-based configuration.
- Frontend/backend API integration.

---

## Technology Stack

| Technology | Implementation |
|---|---|
| Next.js 16 | Frontend framework |
| React | UI components |
| TypeScript | Frontend type safety |
| Node.js | Backend runtime |
| Express.js | REST API |
| PostgreSQL 15 | Relational database |
| Sequelize | ORM and database operations |
| Redis 7 | Caching infrastructure |
| JWT | Authentication |
| Google OAuth 2.0 | Social authentication integration |
| Docker Compose | Local service orchestration |
| Vercel | Frontend deployment |
| Render | Backend deployment |

## Application Architecture

```text
              ┌──────────────────────────┐
              │       Next.js 16         │
              │    React + TypeScript    │
              │        Frontend         │
              └────────────┬─────────────┘
                           │
                       REST API
                           │
              ┌────────────▼─────────────┐
              │       Express.js         │
              │        Node.js           │
              │        Backend           │
              └────────────┬─────────────┘
                           │
                ┌──────────┼──────────┐
                │          │          │
          ┌─────▼────┐ ┌───▼────┐ ┌──▼────────┐
          │PostgreSQL│ │ Redis  │ │ OCR       │
          │Database  │ │ Cache  │ │ Services  │
          └──────────┘ └────────┘ └───────────┘
```

## Project Structure

```text
ExpenseAI-Advanced-Clean/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── models/
│   │   └── scripts/
│   ├── package.json
│   └── ...
│
├── frontend/
│   ├── src/
│   │   └── app/
│   │       ├── (auth)/
│   │       └── (dashboard)/
│   ├── package.json
│   └── ...
│
├── docker-compose.yml
├── README.md
└── ...
```

## Local Installation

### Prerequisites

- Node.js and npm
- PostgreSQL
- Redis
- Docker Desktop (recommended)

### 1. Clone Repository

```bash
git clone https://github.com/PushpakGanganmale/ExpenseAI-Advanced-Clean.git

cd ExpenseAI-Advanced-Clean
```

### 2. Configure Environment Variables

Configure the backend and frontend environment variables using the provided example files.

Frontend API configuration:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

Configure database credentials, JWT secrets, Redis connection, and OAuth credentials in the backend environment file.

Never commit actual credentials or `.env` files.

### 3. Start Infrastructure

```bash
docker-compose up -d
```

This starts the configured PostgreSQL and Redis services.

### 4. Start Backend

```bash
cd backend
npm install
npm start
```

### 5. Start Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the application:

```text
http://localhost:3000
```

## Deployment

The application is deployed using separate frontend and backend services.

**Frontend – Vercel**
- Production frontend hosting.
- Environment-based backend API configuration.
- Production build optimization.

**Backend – Render**
- Node.js and Express API hosting.
- PostgreSQL connectivity.
- Production environment configuration.
- Health endpoint monitoring.

## Engineering Challenges

During development and deployment, several practical engineering problems were addressed:

**1. PostgreSQL Cloud Connectivity**

Configured PostgreSQL connectivity for local Docker development and cloud deployment, including resolving Supabase IPv4/IPv6 connection compatibility through the Session Pooler.

**2. Google OAuth Configuration**

Worked on Google OAuth callback URLs and frontend/backend authentication integration across local and production environments.

**3. Production API Integration**

Configured frontend API URLs and resolved local-versus-production backend endpoint mismatches.

**4. Docker Infrastructure**

Configured a multi-container local environment using PostgreSQL 15, Redis 7, and the Node.js backend.

**5. Next.js Production Build**

Resolved TypeScript, JSX, and production compilation issues.

**6. UTF-8 Encoding and UI Rendering**

Fixed character encoding issues affecting dashboard icons and notification messages, restoring the intended UI presentation.

**7. File Upload Handling**

Worked on file-upload compatibility for production deployment using memory-based upload handling and temporary storage.

**8. GitHub and Deployment Workflow**

Maintained the project repository and pushed frontend and backend updates to GitHub to support production deployment.

## Future Improvements

- More advanced AI-powered expense categorization.
- Enhanced receipt OCR automation.
- Email and notification integrations.
- Multi-currency financial management.
- Bank account integration.
- Mobile application.

## License

MIT License.

## Author

**Pushpak Ganganmale**

- GitHub: [PushpakGanganmale](https://github.com/PushpakGanganmale)
- LinkedIn: [Pushpak Ganganmale](https://linkedin.com/in/pushpakganganmale/)

---

*Built as a full-stack development project to explore modern frontend engineering, REST API development, relational database management, authentication, and cloud deployment.*
