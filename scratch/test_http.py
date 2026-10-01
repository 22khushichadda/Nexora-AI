import urllib.request
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

try:
    with urllib.request.urlopen("http://127.0.0.1:8000/") as response:
        data = json.loads(response.read().decode('utf-8'))
        print("Backend Root Response:", data)
except Exception as e:
    print("Error calling backend:", e)
