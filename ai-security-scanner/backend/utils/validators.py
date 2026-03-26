from config.settings import config

def validate_code_input(code: str, language: str) -> tuple:
    """
    Validate code and language input.
    Returns (is_valid, error_message)
    """
    
    if not code or not code.strip():
        return False, "Code cannot be empty"
    
    if len(code) > config.MAX_CODE_LENGTH:
        return False, f"Code exceeds maximum length of {config.MAX_CODE_LENGTH} characters"
    
    if language not in config.SUPPORTED_LANGUAGES:
        return False, f"Unsupported language. Supported: {', '.join(config.SUPPORTED_LANGUAGES)}"
    
    return True, None
