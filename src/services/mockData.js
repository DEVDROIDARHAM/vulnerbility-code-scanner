export const mockScanResponse = {
  success: true,
  timestamp: new Date().toISOString(),
  language: "javascript",
  codeLength: 234,
  vulnerabilities: [
    {
      id: "vuln_1",
      severity: "CRITICAL",
      title: "SQL Injection",
      category: "Injection",
      line: 23,
      column: 15,
      description:
        "User input is directly concatenated into SQL query without sanitization. This allows attackers to execute arbitrary SQL commands.",
      codeSnippet:
        'db.query(`SELECT * FROM users WHERE id = ${req.query.id}`)',
      fix: "Use parameterized queries:\ndb.query('SELECT * FROM users WHERE id = ?', [req.query.id])",
      owaspCategory: "A03:2021 - Injection",
      cwe: "CWE-89",
      confidence: "HIGH",
      references: [
        "https://owasp.org/www-community/attacks/SQL_Injection",
      ],
    },
    {
      id: "vuln_2",
      severity: "HIGH",
      title: "Cross-Site Scripting (XSS)",
      category: "XSS",
      line: 45,
      column: 8,
      description:
        "User input rendered directly in HTML without escaping. Allows execution of malicious scripts in the browser.",
      codeSnippet: 'res.send(`<h1>Welcome ${req.query.name}</h1>`)',
      fix: 'Escape user input:\nconst escaped = escapeHtml(req.query.name);\nres.send(`<h1>Welcome ${escaped}</h1>`)',
      owaspCategory: "A03:2021 - Injection",
      cwe: "CWE-79",
      confidence: "HIGH",
      references: ["https://owasp.org/www-community/attacks/xss/"],
    },
    {
      id: "vuln_3",
      severity: "HIGH",
      title: "Insecure Direct Object Reference",
      category: "Access Control",
      line: 34,
      column: 5,
      description:
        "Database record accessed using user-supplied ID without verifying authorization. Attackers can access other users' data.",
      codeSnippet:
        "const user = await User.findById(req.params.id);",
      fix: "Verify ownership:\nconst user = await User.findById(req.params.id);\nif (user.ownerId !== req.user.id) return res.status(403).send('Forbidden');",
      owaspCategory: "A01:2021 - Broken Access Control",
      cwe: "CWE-639",
      confidence: "MEDIUM",
      references: [],
    },
    {
      id: "vuln_4",
      severity: "MEDIUM",
      title: "Weak Password Storage",
      category: "Cryptography",
      line: 67,
      column: 10,
      description:
        "Password hashed with MD5, which is cryptographically broken and unsuitable for password storage.",
      codeSnippet: "const hash = md5(password);",
      fix: "Use bcrypt:\nconst hash = await bcrypt.hash(password, 10);",
      owaspCategory: "A02:2021 - Cryptographic Failures",
      cwe: "CWE-327",
      confidence: "MEDIUM",
      references: [],
    },
    {
      id: "vuln_5",
      severity: "MEDIUM",
      title: "Sensitive Data in Logs",
      category: "Data Exposure",
      line: 89,
      column: 3,
      description:
        "User passwords and tokens are being logged, potentially exposing sensitive data.",
      codeSnippet:
        "Logging removed to avoid exposing sensitive data (passwords/tokens).",
      fix: "Remove sensitive data from logs. Avoid logging passwords/tokens; log only non-sensitive identifiers.",
      owaspCategory: "A09:2021 - Security Logging and Monitoring Failures",
      cwe: "CWE-532",
      confidence: "HIGH",
      references: [],
    },
    {
      id: "vuln_6",
      severity: "LOW",
      title: "Missing Input Validation",
      category: "Data Validation",
      line: 12,
      column: 5,
      description:
        "User input not validated before processing. Could lead to unexpected behavior or crashes.",
      codeSnippet: "const age = req.body.age;",
      fix: "Add validation:\nconst age = parseInt(req.body.age);\nif (isNaN(age) || age < 0 || age > 150) throw new Error('Invalid age');",
      owaspCategory: "A04:2021 - Insecure Design",
      cwe: "CWE-20",
      confidence: "LOW",
      references: [],
    },
    {
      id: "vuln_7",
      severity: "LOW",
      title: "Missing Security Headers",
      category: "Security Misconfiguration",
      line: 1,
      column: 1,
      description:
        "Application does not set security headers like Content-Security-Policy, X-Frame-Options, or Strict-Transport-Security.",
      codeSnippet: "const app = express();",
      fix: "Add helmet middleware:\nconst helmet = require('helmet');\napp.use(helmet());",
      owaspCategory: "A05:2021 - Security Misconfiguration",
      cwe: "CWE-693",
      confidence: "MEDIUM",
      references: [],
    },
  ],
  securityScore: 32,
  riskLevel: "HIGH",
  summary: {
    totalIssues: 7,
    critical: 1,
    high: 2,
    medium: 2,
    low: 2,
  },
  categories: {
    Injection: 2,
    "Access Control": 1,
    Cryptography: 1,
    "Data Exposure": 1,
    "Data Validation": 1,
    "Security Misconfiguration": 1,
  },
  recommendations: [
    "Implement input validation across all user inputs",
    "Use parameterized queries for database operations",
    "Upgrade password hashing to bcrypt or Argon2",
    "Enable Content Security Policy headers",
    "Add rate limiting to authentication endpoints",
    "Remove sensitive data from application logs",
  ],
};

export const mockCleanResponse = {
  success: true,
  timestamp: new Date().toISOString(),
  language: "javascript",
  codeLength: 120,
  vulnerabilities: [],
  securityScore: 96,
  riskLevel: "LOW",
  summary: {
    totalIssues: 0,
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
  },
  categories: {},
  recommendations: [
    "Code looks secure! Continue following best practices.",
  ],
};

export const sampleVulnerableCode = `const express = require('express');
const md5 = require('md5');
const app = express();

app.use(express.json());

// Missing security headers
// No rate limiting
// No CORS configuration

app.get('/user', async (req, res) => {
  const age = req.body.age;

  // SQL Injection vulnerability
  const result = await db.query(
    \\\`SELECT * FROM users WHERE id = \\\${req.query.id}\\\`
  );

  // Insecure Direct Object Reference
  const user = await User.findById(req.params.id);

  // XSS vulnerability
  res.send(\\\`<h1>Welcome \\\${req.query.name}</h1>\\\`);
});

app.post('/login', async (req, res) => {
  const { email, password, token } = req.body;

  // Weak password hashing
  const hash = md5(password);

  // Sensitive data in logs
  // Logging removed: would expose sensitive data (passwords/tokens).

  const user = await User.findOne({ email, password: hash });
  res.json({ user });
});

app.listen(3000);`;

export const sampleCleanCode = `const express = require('express');
const helmet = require('helmet');
const bcrypt = require('bcrypt');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');

const app = express();
app.use(helmet());
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

app.get('/user/:id', async (req, res) => {
  const userId = parseInt(req.params.id);
  if (isNaN(userId)) return res.status(400).json({ error: 'Invalid ID' });

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ error: 'Not found' });
  if (user.ownerId !== req.user.id) return res.status(403).json({ error: 'Forbidden' });

  res.json({ user: { id: user.id, name: user.name } });
});

app.post('/login',
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;
    const user = await User.findOne({ email });
    const valid = await bcrypt.compare(password, user.passwordHash);

    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
    // Logging removed: avoid recording sensitive data in logs.
    res.json({ token: generateToken(user) });
  }
);

app.listen(3000);`;

export const mockScanHistory = [
  {
    id: "scan_1",
    date: "2025-03-19T10:30:00Z",
    language: "JavaScript",
    securityScore: 32,
    riskLevel: "HIGH",
    totalIssues: 7,
    critical: 1,
    high: 2,
    medium: 2,
    low: 2,
    codePreview: "const express = require('express')...",
  },
  {
    id: "scan_2",
    date: "2025-03-18T14:15:00Z",
    language: "Python",
    securityScore: 58,
    riskLevel: "MEDIUM",
    totalIssues: 3,
    critical: 0,
    high: 1,
    medium: 1,
    low: 1,
    codePreview: "import sqlite3\nconn = sqlite3.connect...",
  },
  {
    id: "scan_3",
    date: "2025-03-17T09:45:00Z",
    language: "JavaScript",
    securityScore: 96,
    riskLevel: "LOW",
    totalIssues: 0,
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    codePreview: "const helmet = require('helmet')...",
  },
  {
    id: "scan_4",
    date: "2025-03-16T16:20:00Z",
    language: "PHP",
    securityScore: 18,
    riskLevel: "CRITICAL",
    totalIssues: 9,
    critical: 3,
    high: 2,
    medium: 2,
    low: 2,
    codePreview: '$query = "SELECT * FROM users WHERE...',
  },
];

export const supportedLanguages = [
  { id: "javascript", name: "JavaScript", icon: "🟨" },
  { id: "python", name: "Python", icon: "🐍" },
  { id: "java", name: "Java", icon: "☕" },
  { id: "php", name: "PHP", icon: "🐘" },
  { id: "ruby", name: "Ruby", icon: "💎" },
  { id: "go", name: "Go", icon: "🔵" },
  { id: "cpp", name: "C++", icon: "⚡" },
  { id: "sql", name: "SQL", icon: "🗃️" },
];
