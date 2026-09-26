import requests
import uuid

BASE_URL = "http://127.0.0.1:8000"

def test_login_flow():
    print("=== TEST 1: Unauthenticated request to /auth/me ===")
    res = requests.get(f"{BASE_URL}/auth/me")
    print(f"Status Code: {res.status_code}")
    assert res.status_code == 401, f"Expected 401, got {res.status_code}"
    print("PASS: Unauthenticated user is rejected with 401 Unauthorized.")

    print("\n=== TEST 2: Invalid Login ===")
    res = requests.post(f"{BASE_URL}/auth/login", json={"email": "nonexistent@nexora.ai", "password": "wrongpassword"})
    print(f"Status Code: {res.status_code}, Detail: {res.json().get('detail')}")
    assert res.status_code == 400, f"Expected 400, got {res.status_code}"
    print("PASS: Invalid credentials rejected cleanly.")

    print("\n=== TEST 3: Register New User & Login ===")
    unique_email = f"user_{uuid.uuid4().hex[:6]}@nexora.ai"
    reg_res = requests.post(f"{BASE_URL}/auth/register", json={
        "name": "Test Auth User",
        "email": unique_email,
        "password": "Password123!"
    })
    print(f"Registration Status Code: {reg_res.status_code}")
    assert reg_res.status_code == 200, f"Registration failed: {reg_res.text}"

    login_res = requests.post(f"{BASE_URL}/auth/login", json={
        "email": unique_email,
        "password": "Password123!"
    })
    print(f"Login Status Code: {login_res.status_code}")
    assert login_res.status_code == 200, f"Login failed: {login_res.text}"
    token = login_res.json()["access_token"]
    user_info = login_res.json()["user"]
    print(f"PASS: Valid login returned token and user: {user_info['email']} ({user_info['role']})")

    print("\n=== TEST 4: Authenticated /auth/me ===")
    headers = {"Authorization": f"Bearer {token}"}
    res_me = requests.get(f"{BASE_URL}/auth/me", headers=headers)
    print(f"Status Code: {res_me.status_code}, User: {res_me.json().get('email')}")
    assert res_me.status_code == 200
    print("PASS: Valid session retrieved user successfully.")

if __name__ == "__main__":
    test_login_flow()
