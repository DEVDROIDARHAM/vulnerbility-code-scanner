from flask import Blueprint, request, jsonify, current_app
from models import db
from models.user import User
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token
from datetime import timedelta
import re
from extensions import limiter

bcrypt = Bcrypt()

auth_bp = Blueprint('auth', __name__)

def validate_email(email):
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_password(password):
    # Minimum 8 chars, at least 1 letter and 1 number
    return len(password) >= 8 and re.search(r'[A-Za-z]', password) and re.search(r'[0-9]', password)

def validate_username(username):
    # 3-30 chars, alphanumeric and underscores only
    return re.match(r'^[a-zA-Z0-9_]{3,30}$', username) is not None

@auth_bp.route('/login', methods=['POST'])
@limiter.limit("20 per hour")
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({'error': 'Email and password are required'}), 400
            
        user = User.query.filter_by(email=email).first()
        if not user or not bcrypt.check_password_hash(user.password_hash, password):
            return jsonify({'error': 'Invalid email or password'}), 401
            
        if not user.is_active:
            return jsonify({'error': 'Account is disabled'}), 403
            
        token = create_access_token(
            identity=str(user.id),
            expires_delta=timedelta(days=7)
        )
        
        return jsonify({
            'message': 'Login successful',
            'token': token,
            'user': {
                'id': user.id,
                'email': user.email,
                'username': user.username
            }
        }), 200
        
    except Exception as e:
        current_app.logger.exception("Internal error during auth")
        return jsonify({'error': 'An unexpected error occurred'}), 500

@auth_bp.route('/signup', methods=['POST'])
@limiter.limit("10 per hour")
def signup():
    try:
        data = request.get_json()
        email = data.get('email')
        username = data.get('username')
        password = data.get('password')
        
        if not email or not username or not password:
            return jsonify({'error': 'Email, username and password are required'}), 400
            
        if not validate_email(email):
            return jsonify({'error': 'Invalid email format'}), 400

        if not validate_password(password):
            return jsonify({'error': 'Password must be at least 8 characters with letters and numbers'}), 400

        if not validate_username(username):
            return jsonify({'error': 'Username must be 3-30 characters, letters/numbers/underscores only'}), 400
        if User.query.filter_by(email=email).first():
            return jsonify({'error': 'Email already registered'}), 409
            
        if User.query.filter_by(username=username).first():
            return jsonify({'error': 'Username already taken'}), 409
            
        password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
        
        new_user = User(
            email=email,
            username=username,
            password_hash=password_hash
        )
        db.session.add(new_user)
        db.session.commit()
        
        token = create_access_token(
            identity=str(new_user.id),
            expires_delta=timedelta(days=7)
        )
        
        return jsonify({
            'message': 'Account created successfully',
            'token': token,
            'user': {
                'id': new_user.id,
                'email': new_user.email,
                'username': new_user.username
            }
        }), 201
        
    except Exception as e:
        current_app.logger.exception("Internal error during signup")
        return jsonify({'error': 'An unexpected error occurred'}), 500
