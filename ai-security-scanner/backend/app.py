from flask import Flask, jsonify
from extensions import limiter
from flask_limiter.util import get_remote_address
from functools import wraps
from flask_cors import CORS
from dotenv import load_dotenv, find_dotenv
import os

# Load environment variables with override to ensure .env values take precedence
load_dotenv(find_dotenv(), override=True)

from models import db
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from config.settings import SQLALCHEMY_DATABASE_URI
from routes.auth import auth_bp
from routes.scan import scan_bp
from routes.admin import admin_bp
from routes.chat import chat_bp
from middleware.error_handler import register_error_handlers

# Initialize Flask app
app = Flask(__name__)

limiter.init_app(app)

# Security headers middleware
@app.after_request
def add_security_headers(response):
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'DENY'
    response.headers['X-XSS-Protection'] = '1; mode=block'
    response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
    response.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin'
    response.headers['Permissions-Policy'] = 'geolocation=(), microphone=(), camera=()'
    response.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate'
    return response

# Database config
app.config['SQLALCHEMY_DATABASE_URI'] = SQLALCHEMY_DATABASE_URI  
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

jwt_secret = os.environ.get('JWT_SECRET_KEY')
if not jwt_secret:
    raise ValueError("JWT_SECRET_KEY environment variable is not set")
app.config['JWT_SECRET_KEY'] = jwt_secret

# Initialize extensions
db.init_app(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

# Create all tables
with app.app_context():
    db.create_all()
    print("Database initialized - tables ready")

# Configure CORS (allow React frontend)
_allowed_origins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:3000",
    "https://scansentinel.vercel.app",
]
_frontend_url = os.environ.get("FRONTEND_URL")
if _frontend_url:
    _allowed_origins.append(_frontend_url)

CORS(app, resources={
    r"/api/*": {
        "origins": _allowed_origins,
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(scan_bp, url_prefix='/api')
app.register_blueprint(admin_bp, url_prefix='/api/admin')
app.register_blueprint(chat_bp, url_prefix='/api/chat')

# Register error handlers
register_error_handlers(app)

@app.errorhandler(404)
def not_found(e):
    return jsonify({'error': 'Resource not found'}), 404

@app.errorhandler(405)
def method_not_allowed(e):
    return jsonify({'error': 'Method not allowed'}), 405

@app.errorhandler(429)
def rate_limit_exceeded(e):
    return jsonify({'error': 'Too many requests. Please slow down.'}), 429

@app.errorhandler(500)
def internal_error(e):
    return jsonify({'error': 'Internal server error'}), 500

# Health check endpoint
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'message': 'AI Security Scanner API is running'}), 200

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    debug = os.getenv('FLASK_DEBUG', 'False').lower() == 'true'
    app.run(host='0.0.0.0', port=port, debug=debug)
