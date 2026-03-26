import requests
import json

BASE_URL = "http://localhost:5000/api/scan"

tests = [
    {
        "name": "JavaScript Vulnerable Scan",
        "payload": {
            "code": "eval(req.body.code);",
            "language": "javascript"
        }
    },
    {
        "name": "Python Vulnerable Scan",
        "payload": {
            "code": "import os\nos.system('ls')",
            "language": "python"
        }
    },
    {
        "name": "Clean Code Scan",
        "payload": {
            "code": "function add(a, b) { return a + b; }",
            "language": "javascript"
        }
    }
]

for test in tests:
    print(f"\n--- Running: {test['name']} ---")
    try:
        response = requests.post(BASE_URL, json=test['payload'])
        if response.status_code == 200:
            data = response.json()
            print(f"Status: SUCCESS")
            print(f"Security Score: {data.get('securityScore')}")
            print(f"Vulnerabilities Found: {len(data.get('vulnerabilities', []))}")
            if data.get('vulnerabilities'):
                for v in data['vulnerabilities']:
                    print(f" - [{v.get('severity')}] {v.get('title')} (Line {v.get('line')})")
        else:
            print(f"Status: FAILED ({response.status_code})")
            print(response.text)
    except Exception as e:
        print(f"Error: {e}")
