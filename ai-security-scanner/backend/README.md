# AI Security Scanner - Backend

Python Flask backend with Claude AI integration.

## Setup

1. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # Mac/Linux
venv\Scripts\activate     # Windows
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create .env from template:
```bash
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY
```

4. Run server:
```bash
python app.py
```

Server runs on http://localhost:5000

## API Endpoints

- POST /api/scan - Scan code
- POST /api/auth/login - Login
- POST /api/auth/signup - Signup
- GET /api/admin/stats - Admin stats
- GET /api/health - Health check
