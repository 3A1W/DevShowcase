# DevShowcase
**DevShowcase** is a portfolio-as-a-service platform designed for students and junior developers to showcase their projects in a visually compelling, recruiter-friendly way.

Instead of sharing raw GitHub repositories, users can create dynamic portfolios with **project descriptions, embedded demos, and customizable templates** to better communicate their work and impact.

## **🚀 Features**
- **🔐 Authentication (Clerk OAuth):**
  - Secure login with GitHub integration
- **📊 Project Dashboard:**
  - Create, edit, and manage portfolio projects
- **🎥 YouTube Video Embeds:**
  - Showcase project demos without large file uploads
- **🎨 Dynamic Theme Engine:**
  - Switch between multiple professional templates
- **👀 Recruiter View / Preview Mode:**
  - See your portfolio exactly how recruiters will
- **🔄 GitHub Integration:**
  - Sync repository metadata automatically
- **🧠 Admin Dashboard:**
  - Separate admin access for platform management

These features are derived from core user needs such as easy portfolio creation, recruiter accessibility, and visual storytelling.

## **🧩 Tech Stack**
- **Frontend**
  - React
  - HTML / CSS
  - Clerk (Authentication UI)
- **Backend**
  - Python
  - FastAPI
  - Uvicorn
  - Pydantic
- **Database**
  - MongoDB (NoSQL)
- **DevOps / Tools**
  - GitHub Actions (CI/CD)
  - GitHub Projects (Agile tracking)
  - Clerk (OAuth / OIDC)

These technologies were selected to support a scalable full-stack architecture with strong API communication and authentication.

## **🏗️ Architecture**

DevShowcase follows a 3-tier architecture:

**1. Frontend (React SPA)**
  - UI, templates, user interactions
**2. Backend (FastAPI)**
  - API routes, authentication handling, business logic
**3. Database (MongoDB)**
Stores users, projects, and metadata

Additional integrations:

- Clerk → Authentication
- GitHub API → Repo data 
- CDN → Media delivery 

## **📂 Project Structure**
DevShowcase/
│
├── frontend/        # React application
├── backend/         # FastAPI server
│   ├── app/
│   ├── routes/
│   ├── models/
│   └── config.py
│
├── .env             # Environment variables (not committed)
├── README.md
└── package.json / requirements.txt

## **⚙️ Setup & Installation**
**1. Clone the Repository**
  - git clone https://github.com/3A1W/DevShowcase.git
  - cd DevShowcase

**2. Backend Setup**
  - cd backend
  - python -m venv .venv
  - source .venv/bin/activate  # or .venv\Scripts\activate (Windows)
  - pip install -r requirements.txt
- Create a .env file in /backend:
  - CLERK_SECRET_KEY=your_key
  - MONGODB_URI=your_uri
  - GITHUB_CLIENT_ID=your_id
  - GITHUB_CLIENT_SECRET=your_secret
  - REDIS_URL=redis://localhost:6379/0
- Run backend:
  - uvicorn main:app --reload --port 8080
 
**3. Frontend Setup**
  - cd frontend
  - npm install
  - npm run dev

## **🔐 Environment Variables**
| Variable               | Description                       |
| ---------------------- | --------------------------------- |
| `CLERK_SECRET_KEY`     | Clerk authentication key          |
| `MONGODB_URI`          | MongoDB connection string         |
| `GITHUB_CLIENT_ID`     | GitHub OAuth client ID            |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth secret               |
| `REDIS_URL`            | Cache layer for API rate limiting |

## **🧪 Testing**
- Login → Create Project → Save → Retrieve
- End-to-end testing (Cypress or similar)
- Expanded backend test cases
 
## **📈 Project Roadmap**
**✅ Sprint 1 (Completed)**
- Authentication (Clerk OAuth)
- Database schema (User & Project)
- Landing page + Theme Engine
- Frontend-backend integration
**✅ Sprint 2 (Completed)**
- GitHub API Sync Service
- User Dashboard UI
- YouTube Embed Component
- Preview Mode (Recruiter View)
- Testing Suite

These tasks align with the prioritized backlog and sprint structure .

## **⚠️ Risks & Considerations**
- GitHub API rate limiting → mitigated with caching
- Schema changes → validated with Pydantic
- Integration issues → resolved with API contracts (Swagger)
- Scope creep → controlled via backlog prioritization

## **👥 Team**
**3A1W**
- Aayudesh Kaparthi — Project Manager
- Jackson Bailey — Frontend Lead
- Samuel Fong — Backend / DevOps
- Tim Le — Backend / DevOps

## **🎯 Vision**
DevShowcase aims to bridge the gap between “code on GitHub” and “impactful storytelling”, helping developers present their work in a way that captures recruiter attention in seconds.
