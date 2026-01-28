# VeloConnect

A web app connecting bicycle repair shops (vélocistes) with users for online appointment booking.

**Frontend**: React + TypeScript + Material UI  
**Backend**: Flask (Python) + SQLite (dev) + JWT authentication + Bcrypt password hashing  
**Goal**: Freelance portfolio project

## Features (current)

- User & pro registration with password hashing
- Secure login + JWT token
- Protected routes (create pro profile, add availability)
- Basic dashboard
- List professionals (with filters – in progress)

## Tech Stack

**Backend**
- Flask
- Flask-SQLAlchemy + Flask-Migrate
- Flask-JWT-Extended
- Flask-Bcrypt
- Flask-CORS

**Frontend**
- React 18 + TypeScript
- Vite
- Material-UI (MUI)
- React Router v6
- Axios
- jwt-decode

**Database**: SQLite (development), PostgreSQL planned for production

## Installation & Quick Start

### Backend

```bash
cd backend
python -m venv venv

# Windows:
.\venv\Scripts\activate

# Linux/macOS:
# source venv/bin/activate

pip install -r requirements.txt
cd src
$env:FLASK_APP = "app:create_app('development')"   # PowerShell
flask db upgrade
flask run
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Author

**Antonin Lerouge**  
Developer

📍 Bordeaux, France  
💼 [LinkedIn](https://www.linkedin.com/in/antonin-lerouge-1a935a132/)  
📧 lerouge.antonin@gmail.com

## License

MIT License
