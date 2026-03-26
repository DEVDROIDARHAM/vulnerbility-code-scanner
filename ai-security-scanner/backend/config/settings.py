import os

# Database
BASE_DIR = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
SQLALCHEMY_DATABASE_URI = f"sqlite:///{os.path.join(BASE_DIR, 'database.db')}"
SQLALCHEMY_TRACK_MODIFICATIONS = False
from dotenv import load_dotenv

load_dotenv()

class Config:
    # Flask
    SECRET_KEY = os.environ.get('JWT_SECRET_KEY')
    if not SECRET_KEY:
        raise ValueError("JWT_SECRET_KEY environment variable is not set")
        
    DEBUG = os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'
    
    # Anthropic API
    ANTHROPIC_API_KEY = os.getenv('ANTHROPIC_API_KEY')
    ANTHROPIC_MODEL = 'claude-sonnet-4-20250514'
    ANTHROPIC_MAX_TOKENS = 3000
    
    # Groq API
    GROQ_API_KEY = os.environ.get('GROQ_API_KEY')
    if not GROQ_API_KEY:
        print("WARNING: GROQ_API_KEY not set — chatbot will not work")
    
    # Security
    JWT_ALGORITHM = 'HS256'
    JWT_EXPIRATION_HOURS = 24
    BCRYPT_ROUNDS = 12
    
    # Validation
    MAX_CODE_LENGTH = 50000  # characters
    SUPPORTED_LANGUAGES = [
        'javascript', 'python', 'java', 'php', 
        'ruby', 'go', 'cpp', 'csharp', 'typescript'
    ]

config = Config()
