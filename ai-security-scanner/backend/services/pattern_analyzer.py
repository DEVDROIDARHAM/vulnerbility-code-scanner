"""
Pattern-based vulnerability detection.
Analyzes code using regex patterns to detect common security issues.
Zero API costs, works offline, professional results.
"""

import re
from typing import List, Dict


class PatternAnalyzer:
    """Detects security vulnerabilities using pattern matching."""

    def __init__(self):
        self.patterns = {
            "javascript": self._get_javascript_patterns(),
            "python": self._get_python_patterns(),
            "php": self._get_php_patterns(),
            "java": self._get_java_patterns(),
            "typescript": self._get_javascript_patterns(),  # Same as JS
            "ruby": self._get_generic_patterns(),
            "go": self._get_generic_patterns(),
            "cpp": self._get_generic_patterns(),
            "csharp": self._get_generic_patterns(),
        }

    def analyze(self, code: str, language: str) -> List[Dict]:
        """
        Analyze code for vulnerabilities using pattern matching.
        Returns list of detected vulnerabilities in Claude-compatible format.
        """
        language = (language or "").lower()
        patterns = self.patterns.get(language, self._get_generic_patterns())

        vulnerabilities: List[Dict] = []
        lines = code.split("\n")

        for pattern_info in patterns:
            matches = self._find_pattern(code, lines, pattern_info)
            vulnerabilities.extend(matches)

        return vulnerabilities

    def _find_pattern(self, code: str, lines: List[str], pattern_info: Dict) -> List[Dict]:
        """Find pattern matches in code and create vulnerability objects."""
        matches: List[Dict] = []
        pattern = pattern_info["pattern"]

        for line_num, line in enumerate(lines, 1):
            if re.search(pattern, line, re.IGNORECASE):
                vuln = {
                    "id": f"vuln_{len(matches) + 1}",
                    "severity": pattern_info["severity"],
                    "title": pattern_info["title"],
                    "category": pattern_info["category"],
                    "owaspCategory": pattern_info["owasp"],
                    "line": line_num,
                    "column": 0,
                    "description": pattern_info["description"],
                    "codeSnippet": line.strip(),
                    "fix": pattern_info["fix"],
                    "confidence": pattern_info["confidence"],
                    "source": "pattern_analysis",
                }
                matches.append(vuln)

        return matches

    def _get_javascript_patterns(self) -> List[Dict]:
        """JavaScript/TypeScript vulnerability patterns."""
        return [
            {
                "pattern": r"\.query\([`\"'].*\$\{.*\}.*[`\"']\)|\.query\([`\"'].*\+.*[`\"']\)",
                "severity": "CRITICAL",
                "title": "SQL Injection Vulnerability",
                "category": "Injection",
                "owasp": "A03:2021 - Injection",
                "description": (
                    "SQL query uses string interpolation or concatenation with user input, allowing "
                    "SQL injection attacks. Attackers can manipulate queries to access or modify "
                    "unauthorized data."
                ),
                "fix": (
                    "Use parameterized queries with placeholders:\n"
                    "db.query(\"SELECT * FROM users WHERE id = ?\", [userId])\n"
                    "// Or use an ORM with proper escaping"
                ),
                "confidence": "HIGH",
            },
            {
                "pattern": r"md5\s*\(",
                "severity": "MEDIUM",
                "title": "Weak Cryptographic Hash (MD5)",
                "category": "Cryptography",
                "owasp": "A02:2021 - Cryptographic Failures",
                "description": (
                    "MD5 is cryptographically broken and vulnerable to collision attacks. It should "
                    "never be used for security purposes like password hashing or data integrity."
                ),
                "fix": (
                    "Use bcrypt for passwords:\n"
                    "const bcrypt = require(\"bcrypt\");\n"
                    "const hash = await bcrypt.hash(password, 10);\n"
                    "// Or use SHA-256 for non-password hashing"
                ),
                "confidence": "HIGH",
            },
            {
                "pattern": r"sha1\s*\(",
                "severity": "MEDIUM",
                "title": "Weak Cryptographic Hash (SHA-1)",
                "category": "Cryptography",
                "owasp": "A02:2021 - Cryptographic Failures",
                "description": (
                    "SHA-1 is deprecated and vulnerable to collision attacks. Modern systems should "
                    "use stronger alternatives."
                ),
                "fix": (
                    "Use SHA-256 or higher:\n"
                    "const crypto = require(\"crypto\");\n"
                    "const hash = crypto.createHash(\"sha256\").update(data).digest(\"hex\");"
                ),
                "confidence": "HIGH",
            },
            {
                # Detect template-literal XSS in res.send(`<... ${user} ...>`)
                "pattern": r"\.send\s*\(\s*[`\"'].*\$\{.*\}.*[`\"']",
                "severity": "HIGH",
                "title": "Cross-Site Scripting (XSS)",
                "category": "XSS",
                "owasp": "A03:2021 - Injection",
                "description": (
                    "HTML response includes unsanitized user input via template literals, allowing "
                    "attackers to inject malicious scripts that execute in victim browsers."
                ),
                "fix": (
                    "Escape user input before rendering:\n"
                    "const escapeHtml = require(\"escape-html\");\n"
                    "const safe = escapeHtml(userInput);\n"
                    "res.send(`<h1>${safe}</h1>`);"
                ),
                "confidence": "HIGH",
            },
            {
                "pattern": r"\beval\s*\(",
                "severity": "CRITICAL",
                "title": "Code Injection via eval()",
                "category": "Injection",
                "owasp": "A03:2021 - Injection",
                "description": (
                    "The eval() function executes arbitrary JavaScript code and is extremely dangerous "
                    "when used with any user-controllable input. Can lead to complete system compromise."
                ),
                "fix": (
                    "Remove eval() entirely. Use JSON.parse() for data:\n"
                    "const data = JSON.parse(userInput);\n"
                    "// Or use a sandboxed environment if code execution is required"
                ),
                "confidence": "HIGH",
            },
            {
                "pattern": r"innerHTML\s*=.*\$\{",
                "severity": "HIGH",
                "title": "DOM-based XSS via innerHTML",
                "category": "XSS",
                "owasp": "A03:2021 - Injection",
                "description": (
                    "Setting innerHTML with user input can execute malicious scripts. Modern browsers "
                    "parse HTML in innerHTML, making it vulnerable to XSS."
                ),
                "fix": (
                    "Use textContent for text or sanitize HTML:\n"
                    "element.textContent = userInput; // Safe for text\n"
                    "// Or use DOMPurify for HTML: element.innerHTML = DOMPurify.sanitize(html);"
                ),
                "confidence": "MEDIUM",
            },
            {
                "pattern": r"document\.write\s*\(.*\$\{",
                "severity": "HIGH",
                "title": "DOM-based XSS via document.write",
                "category": "XSS",
                "owasp": "A03:2021 - Injection",
                "description": (
                    "document.write() with user input can inject malicious scripts. This method is "
                    "deprecated and inherently unsafe."
                ),
                "fix": (
                    "Use safe DOM methods:\n"
                    "const element = document.createElement(\"p\");\n"
                    "element.textContent = userInput;\n"
                    "parent.appendChild(element);"
                ),
                "confidence": "HIGH",
            },
            {
                "pattern": r"(localStorage|sessionStorage)\.setItem\([^,]+,\s*(password|token|secret|key)",
                "severity": "HIGH",
                "title": "Sensitive Data in Browser Storage",
                "category": "Data Exposure",
                "owasp": "A02:2021 - Cryptographic Failures",
                "description": (
                    "Storing sensitive data like passwords or tokens in browser storage is insecure. "
                    "LocalStorage and sessionStorage are accessible to JavaScript and vulnerable to XSS "
                    "attacks."
                ),
                "fix": (
                    "Never store passwords client-side. Use secure HTTP-only cookies for tokens:\n"
                    "// Server sets: Set-Cookie: token=xxx; HttpOnly; Secure; SameSite=Strict\n"
                    "// Client cannot access token via JavaScript"
                ),
                "confidence": "HIGH",
            },
            {
                "pattern": r"\.html\s*\(.*\$\{",
                "severity": "HIGH",
                "title": "XSS via jQuery .html()",
                "category": "XSS",
                "owasp": "A03:2021 - Injection",
                "description": (
                    "jQuery's .html() method with user input can execute scripts, similar to innerHTML."
                ),
                "fix": (
                    "Use .text() for plain text:\n"
                    "$element.text(userInput);\n"
                    "// Or sanitize HTML: $element.html(DOMPurify.sanitize(html));"
                ),
                "confidence": "MEDIUM",
            },
        ]

    def _get_python_patterns(self) -> List[Dict]:
        """Python vulnerability patterns."""
        return [
            {
                # Example:
                # query = "SELECT ..." + request.args["id"]
                "pattern": r"['\"][^'\"]*(SELECT|INSERT|UPDATE|DELETE)[^'\"]*['\"]\s*\+\s*request\.(args|form|values|json)\s*\[",
                "severity": "CRITICAL",
                "title": "SQL Injection Vulnerability",
                "category": "Injection",
                "owasp": "A03:2021 - Injection",
                "description": (
                    "SQL query is built by concatenating user-controlled input into a SQL string, "
                    "making it vulnerable to SQL injection attacks."
                ),
                "fix": (
                    "Use parameterized queries:\n"
                    "cursor.execute(\"SELECT * FROM users WHERE id = %s\", (user_id,))\n"
                    "// Never use: \"...WHERE id = \" + user_id"
                ),
                "confidence": "HIGH",
            },
            {
                "pattern": r"(execute|executemany)\s*\([^)]*[\+%][^)]*\)|\.format\s*\([^)]*\).*execute",
                "severity": "CRITICAL",
                "title": "SQL Injection Vulnerability",
                "category": "Injection",
                "owasp": "A03:2021 - Injection",
                "description": (
                    "SQL execution uses string concatenation/formatting with user input, allowing SQL "
                    "injection."
                ),
                "fix": (
                    "Use parameterized queries:\n"
                    "cursor.execute(\"SELECT * FROM users WHERE id = %s\", (user_id,))\n"
                    "// Never use string concatenation for SQL."
                ),
                "confidence": "HIGH",
            },
            {
                "pattern": r"\bexec\s*\(",
                "severity": "CRITICAL",
                "title": "Arbitrary Code Execution",
                "category": "Injection",
                "owasp": "A03:2021 - Injection",
                "description": (
                    "The exec() function executes arbitrary Python code and is extremely dangerous, "
                    "especially when any user input can reach it."
                ),
                "fix": (
                    "Remove exec() entirely. Use safe alternatives:\n"
                    "# For data: data = json.loads(user_input)\n"
                    "# Never execute user-provided code"
                ),
                "confidence": "HIGH",
            },
            {
                "pattern": r"\beval\s*\(",
                "severity": "CRITICAL",
                "title": "Code Injection via eval()",
                "category": "Injection",
                "owasp": "A03:2021 - Injection",
                "description": (
                    "The eval() function evaluates arbitrary expressions and should never be used with "
                    "user input."
                ),
                "fix": (
                    "Use ast.literal_eval() for safe evaluation of literals:\n"
                    "import ast\n"
                    "data = ast.literal_eval(user_input)  # Only evaluates literals"
                ),
                "confidence": "HIGH",
            },
            {
                "pattern": r"pickle\.loads?\s*\(",
                "severity": "HIGH",
                "title": "Insecure Deserialization",
                "category": "Deserialization",
                "owasp": "A08:2021 - Software and Data Integrity Failures",
                "description": (
                    "pickle can execute arbitrary code during deserialization. Never unpickle data from "
                    "untrusted sources."
                ),
                "fix": (
                    "Use JSON for data serialization:\n"
                    "import json\n"
                    "data = json.loads(user_input)  # Safe for data"
                ),
                "confidence": "HIGH",
            },
            {
                "pattern": r"import md5|from.*md5|hashlib\.md5",
                "severity": "MEDIUM",
                "title": "Weak Cryptographic Hash (MD5)",
                "category": "Cryptography",
                "owasp": "A02:2021 - Cryptographic Failures",
                "description": (
                    "MD5 is cryptographically broken and should not be used for security purposes."
                ),
                "fix": (
                    "Use bcrypt for password hashing:\n"
                    "import bcrypt\n"
                    "hashed = bcrypt.hashpw(password.encode(), bcrypt.gensalt())\n"
                    "// Or use SHA-256 for non-password hashing"
                ),
                "confidence": "HIGH",
            },
            {
                "pattern": r"hashlib\.sha1",
                "severity": "MEDIUM",
                "title": "Weak Cryptographic Hash (SHA-1)",
                "category": "Cryptography",
                "owasp": "A02:2021 - Cryptographic Failures",
                "description": "SHA-1 is deprecated and vulnerable to collision attacks.",
                "fix": (
                    "Use SHA-256 or higher:\n"
                    "import hashlib\n"
                    "hash_obj = hashlib.sha256(data.encode())"
                ),
                "confidence": "HIGH",
            },
            {
                "pattern": r"os\.system\s*\(",
                "severity": "HIGH",
                "title": "Command Injection Risk",
                "category": "Injection",
                "owasp": "A03:2021 - Injection",
                "description": (
                    "os.system() with user input allows command injection. Attackers can execute arbitrary "
                    "system commands."
                ),
                "fix": (
                    "Use subprocess with list arguments:\n"
                    "import subprocess\n"
                    "subprocess.run([\"ls\", \"-l\"], shell=False)  # Safe, no shell injection"
                ),
                "confidence": "HIGH",
            },
            {
                "pattern": r"subprocess.*shell\s*=\s*True",
                "severity": "HIGH",
                "title": "Command Injection via shell=True",
                "category": "Injection",
                "owasp": "A03:2021 - Injection",
                "description": "Using shell=True can allow shell injection if user input is involved.",
                "fix": (
                    "Use shell=False and pass commands as a list:\n"
                    "subprocess.run([\"command\", \"arg1\", \"arg2\"], shell=False)"
                ),
                "confidence": "MEDIUM",
            },
            {
                "pattern": r"random\.random\s*\(",
                "severity": "LOW",
                "title": "Weak Random Number Generator",
                "category": "Cryptography",
                "owasp": "A02:2021 - Cryptographic Failures",
                "description": (
                    "random.random() is not cryptographically secure and should not be used for security "
                    "tokens or passwords."
                ),
                "fix": (
                    "Use secrets module for security:\n"
                    "import secrets\n"
                    "token = secrets.token_urlsafe(32)"
                ),
                "confidence": "MEDIUM",
            },
        ]

    def _get_php_patterns(self) -> List[Dict]:
        """PHP vulnerability patterns."""
        return [
            {
                "pattern": r"\$_(GET|POST|REQUEST|COOKIE)\[.*\].*\b(query|mysql_query|mysqli_query)",
                "severity": "CRITICAL",
                "title": "SQL Injection Vulnerability",
                "category": "Injection",
                "owasp": "A03:2021 - Injection",
                "description": (
                    "SQL query directly uses user input from superglobals without sanitization, allowing "
                    "SQL injection."
                ),
                "fix": (
                    "Use prepared statements:\n"
                    '$stmt = $pdo->prepare(\"SELECT * FROM users WHERE id = ?\");\n'
                    '$stmt->execute([$_GET[\"id\"]]);'
                ),
                "confidence": "HIGH",
            },
            {
                "pattern": r"\becho\b.*\$_(GET|POST|REQUEST|COOKIE)",
                "severity": "HIGH",
                "title": "Cross-Site Scripting (XSS)",
                "category": "XSS",
                "owasp": "A03:2021 - Injection",
                "description": "Echoing user input without escaping allows XSS attacks.",
                "fix": 'Escape output: echo htmlspecialchars($_GET["name"], ENT_QUOTES, "UTF-8");',
                "confidence": "HIGH",
            },
            {
                "pattern": r"\bmd5\s*\(\s*\$_(GET|POST|REQUEST)|md5.*password",
                "severity": "MEDIUM",
                "title": "Weak Password Hashing (MD5)",
                "category": "Cryptography",
                "owasp": "A02:2021 - Cryptographic Failures",
                "description": "MD5 is not suitable for password hashing and can be easily cracked.",
                "fix": "Use password_hash(): $hash = password_hash($password, PASSWORD_BCRYPT);",
                "confidence": "HIGH",
            },
            {
                "pattern": r"\beval\s*\(",
                "severity": "CRITICAL",
                "title": "Code Injection via eval()",
                "category": "Injection",
                "owasp": "A03:2021 - Injection",
                "description": "eval() executes arbitrary PHP code and is extremely dangerous.",
                "fix": "Remove eval() and never execute user input as code.",
                "confidence": "HIGH",
            },
        ]

    def _get_java_patterns(self) -> List[Dict]:
        """Java vulnerability patterns."""
        return [
            {
                "pattern": r"Statement.*executeQuery.*[\+\.]",
                "severity": "CRITICAL",
                "title": "SQL Injection Vulnerability",
                "category": "Injection",
                "owasp": "A03:2021 - Injection",
                "description": (
                    "SQL query concatenates user input using Statement, allowing SQL injection."
                ),
                "fix": (
                    "Use PreparedStatement:\n"
                    "PreparedStatement stmt = conn.prepareStatement(\"SELECT * FROM users WHERE id = ?\");\n"
                    "stmt.setString(1, userId);"
                ),
                "confidence": "HIGH",
            },
            {
                "pattern": r'MessageDigest\.getInstance\s*\(\s*["\']MD5["\']',
                "severity": "MEDIUM",
                "title": "Weak Cryptographic Hash (MD5)",
                "category": "Cryptography",
                "owasp": "A02:2021 - Cryptographic Failures",
                "description": "MD5 is cryptographically broken.",
                "fix": 'Use SHA-256 or bcrypt: MessageDigest.getInstance("SHA-256")',
                "confidence": "HIGH",
            },
        ]

    def _get_generic_patterns(self) -> List[Dict]:
        """Generic patterns that work across multiple languages."""
        return [
            {
                "pattern": r"password\s*=\s*[\"'][^\"']{3,}[\"']",
                "severity": "CRITICAL",
                "title": "Hardcoded Password",
                "category": "Authentication",
                "owasp": "A07:2021 - Identification and Authentication Failures",
                "description": (
                    "Password is hardcoded in source code, which is a serious security risk. Passwords should "
                    "never be in code."
                ),
                "fix": 'Use environment variables: password = os.getenv("DB_PASSWORD")',
                "confidence": "HIGH",
            },
            {
                "pattern": r"(api[_-]?key|apikey|api_secret)\s*=\s*[\"'][a-zA-Z0-9]{20,}[\"']",
                "severity": "CRITICAL",
                "title": "Hardcoded API Key",
                "category": "Data Exposure",
                "owasp": "A02:2021 - Cryptographic Failures",
                "description": "API key is hardcoded in source code. If code is exposed, the key is compromised.",
                "fix": 'Use environment variables: api_key = os.getenv("API_KEY")',
                "confidence": "HIGH",
            },
            {
                "pattern": r"(secret[_-]?key|private[_-]?key)\s*=\s*[\"'][^\"']{10,}[\"']",
                "severity": "HIGH",
                "title": "Hardcoded Secret Key",
                "category": "Data Exposure",
                "owasp": "A02:2021 - Cryptographic Failures",
                "description": "Secret key is hardcoded in source code.",
                "fix": "Use environment variables and key management systems",
                "confidence": "MEDIUM",
            },
        ]


# Create singleton instance (imported by analyzers)
pattern_analyzer = PatternAnalyzer()

