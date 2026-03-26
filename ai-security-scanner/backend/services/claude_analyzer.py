import os
import json
from typing import List, Dict

from anthropic import Anthropic

from config.settings import config
from services.pattern_analyzer import pattern_analyzer


# Default to pattern analysis to avoid API costs.
# Set USE_PATTERN_ANALYSIS=false in .env to use Claude (requires credits).
USE_PATTERN_ANALYSIS = os.getenv("USE_PATTERN_ANALYSIS", "true").lower() == "true"

_client = None


def _get_client() -> Anthropic:
    """Lazy-init Claude client (only when Claude mode is enabled)."""
    global _client
    if _client is not None:
        return _client
    if not config.ANTHROPIC_API_KEY:
        raise ValueError("ANTHROPIC_API_KEY is not set")
    _client = Anthropic(api_key=config.ANTHROPIC_API_KEY)
    return _client


def analyze_code_with_claude(code: str, language: str) -> List[Dict]:
    """
    Analyze code for security vulnerabilities.

    By default uses pattern-based detection (free, unlimited scans).
    Set USE_PATTERN_ANALYSIS=false in .env to use Claude API (requires credits).

    Returns list of vulnerabilities in standard format compatible with the rest
    of the backend.
    """
    if USE_PATTERN_ANALYSIS:
        return pattern_analyzer.analyze(code, language)

    # Claude API path (may require credits). If it fails, fall back to patterns.
    prompt = (
        f"You are an expert security analyst. Analyze this {language} code for security vulnerabilities.\n\n"
        f"Code to analyze:\n```{language}\n{code}\n```\n\n"
        "Instructions:\n"
        "1. Identify ALL security vulnerabilities (SQL injection, XSS, authentication issues, etc.)\n"
        "2. Cover OWASP Top 10 categories\n"
        "3. For each vulnerability, provide:\n"
        "   - Exact line number where it occurs\n"
        "   - Severity level (CRITICAL, HIGH, MEDIUM, LOW)\n"
        "   - Clear description of the issue\n"
        "   - Specific fix with code example\n"
        "   - OWASP category\n\n"
        "Return ONLY a valid JSON array with this EXACT structure (no markdown, no backticks):\n"
        "[\n"
        "  {\n"
        '    "id": "unique_id",\n'
        '    "severity": "CRITICAL|HIGH|MEDIUM|LOW",\n'
        '    "title": "Vulnerability Name",\n'
        '    "category": "Category Name",\n'
        '    "owaspCategory": "A0X:2021 - Category",\n'
        '    "line": 23,\n'
        '    "column": 10,\n'
        '    "description": "Detailed description of the vulnerability",\n'
        '    "codeSnippet": "The vulnerable code line",\n'
        '    "fix": "Specific fix with code example",\n'
        '    "confidence": "HIGH|MEDIUM|LOW"\n'
        "  }\n"
        "]\n\n"
        "If no vulnerabilities found, return empty array: []"
    )

    try:
        client = _get_client()
        message = client.messages.create(
            model=config.ANTHROPIC_MODEL,
            max_tokens=config.ANTHROPIC_MAX_TOKENS,
            messages=[{"role": "user", "content": prompt}],
        )

        response_text = message.content[0].text.strip()

        # Remove markdown code blocks if present
        if response_text.startswith("```"):
            parts = response_text.split("```")
            if len(parts) >= 2:
                response_text = parts[1]
            if response_text.lstrip().startswith("json"):
                response_text = response_text.lstrip()[4:].strip()

        vulnerabilities = json.loads(response_text)
        return vulnerabilities if isinstance(vulnerabilities, list) else []

    except json.JSONDecodeError:
        return pattern_analyzer.analyze(code, language)

    except Exception:
        return pattern_analyzer.analyze(code, language)
