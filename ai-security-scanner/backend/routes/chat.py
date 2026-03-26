from flask import Blueprint, request, jsonify, current_app
from groq import Groq
import os

chat_bp = Blueprint('chat', __name__)

# System prompt — keeps chatbot focused on security only
SYSTEM_PROMPT = """You are ScanSentinel AI, an expert cybersecurity assistant 
built into the ScanSentinel vulnerability scanner. You ONLY answer questions 
related to:
- Code security and vulnerabilities
- OWASP Top 10 categories
- Security best practices
- Common attack types (SQL injection, XSS, CSRF, etc.)
- How to fix security vulnerabilities
- Secure coding practices
- Web application security
- API security
- Authentication and authorization

If asked anything unrelated to cybersecurity or code security, 
respond with: "I'm ScanSentinel AI, specialized in cybersecurity topics only. 
Please ask me about code security, vulnerabilities, or security best practices."

Keep responses concise, practical, and developer-friendly.
Use code examples when helpful.
Format responses clearly with proper structure."""


@chat_bp.route('', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        message = data.get('message', '').strip()
        history = data.get('history', [])  # previous messages for context
        
        if not message:
            return jsonify({'error': 'Message cannot be empty'}), 400
        
        if len(message) > 2000:
            return jsonify({'error': 'Message too long. Maximum 2000 characters.'}), 400
        
        # Initialize Groq client inside the route to ensure environment variables are fresh
        api_key = os.environ.get('GROQ_API_KEY')
        if not api_key:
            return jsonify({'error': 'ScanSentinel AI is not configured. Please add GROQ_API_KEY to .env'}), 500
            
        client = Groq(api_key=api_key)
        
        # Build messages array with history for context
        messages = [{"role": "system", "content": SYSTEM_PROMPT}]
        
        # Add last 6 messages of history for context (3 exchanges)
        for msg in history[-6:]:
            if msg.get('role') in ['user', 'assistant'] and msg.get('content'):
                messages.append({
                    "role": msg['role'],
                    "content": msg['content']
                })
        
        # Add current message
        messages.append({"role": "user", "content": message})
        
        # Call Groq API (Llama 3.3 70B)
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=messages,
            max_tokens=1024,
            temperature=0.7,
        )
        
        response_text = completion.choices[0].message.content
        
        return jsonify({
            'response': response_text,
            'model': 'llama-3.3-70b-versatile'
        }), 200
        
    except Exception as e:
        current_app.logger.exception("Chat error")
        return jsonify({'error': 'Failed to get response. Please try again.'}), 500
