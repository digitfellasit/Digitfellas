#!/usr/bin/env python3
"""
Backend API Test Suite for Digitfellas Dynamic Site
Tests all API endpoints including auth, CRUD operations, and uploads
"""

import requests
import json
import os
import tempfile
from pathlib import Path

# Get base URL from environment
BASE_URL = os.getenv('NEXT_PUBLIC_BASE_URL', 'https://digitfellascrm.preview.emergentagent.com')
API_BASE = f"{BASE_URL}/api"

class DigitfellasAPITester:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'Content-Type': 'application/json',
            'User-Agent': 'DigitfellasAPITester/1.0'
        })
        self.auth_cookie = None
        
    def test_health_check(self):
        """Test basic API health check"""
        print("\n=== Testing Health Check ===")
        try:
            response = self.session.get(f"{API_BASE}/")
            print(f"Health check status: {response.status_code}")
            if response.status_code == 200:
                data = response.json()
                print(f"Response: {data}")
                if 'ok' in data and data['ok'] and 'name' in data:
                    print("✅ Health check passed")
                    return True
                else:
                    print("❌ Health check response missing expected fields")
                    return False
            else:
                print(f"❌ Health check failed with status {response.status_code}")
                return False
        except Exception as e:
            print(f"❌ Health check error: {e}")
            return False

    def test_site_endpoint(self):
        """Test GET /api/site returns JSON with expected keys"""
        print("\n=== Testing GET /api/site ===")
        try:
            response = self.session.get(f"{API_BASE}/site")
            print(f"Site endpoint status: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                print(f"Site data keys: {list(data.keys())}")
                
                # Check for expected top-level keys
                expected_keys = ['brand', 'navigation', 'home', 'pages', 'footer', '_meta']
                missing_keys = [key for key in expected_keys if key not in data]
                
                if missing_keys:
                    print(f"❌ Missing expected keys: {missing_keys}")
                    return False
                else:
                    print("✅ Site endpoint has all expected keys")
                    
                    # Check brand name
                    if data.get('brand', {}).get('name') == 'Digitfellas':
                        print("✅ Brand name is correct")
                    else:
                        print(f"❌ Brand name incorrect: {data.get('brand', {}).get('name')}")
                        
                    return True
            else:
                print(f"❌ Site endpoint failed with status {response.status_code}")
                return False
        except Exception as e:
            print(f"❌ Site endpoint error: {e}")
            return False

    def test_resource_endpoints(self):
        """Test GET endpoints for services, projects, blog, navigation, footer"""
        print("\n=== Testing Resource Endpoints ===")
        endpoints = ['services', 'projects', 'blog', 'navigation', 'footer']
        results = {}
        
        for endpoint in endpoints:
            try:
                print(f"\nTesting GET /api/{endpoint}")
                response = self.session.get(f"{API_BASE}/{endpoint}")
                print(f"Status: {response.status_code}")
                
                if response.status_code == 200:
                    data = response.json()
                    print(f"Response type: {type(data)}")
                    
                    if endpoint in ['services', 'projects', 'blog']:
                        # These should return arrays
                        if isinstance(data, list):
                            print(f"✅ {endpoint} returned array with {len(data)} items")
                            results[endpoint] = True
                        else:
                            print(f"❌ {endpoint} should return array, got {type(data)}")
                            results[endpoint] = False
                    else:
                        # navigation and footer should return objects
                        if isinstance(data, dict):
                            print(f"✅ {endpoint} returned object with keys: {list(data.keys())}")
                            results[endpoint] = True
                        else:
                            print(f"❌ {endpoint} should return object, got {type(data)}")
                            results[endpoint] = False
                else:
                    print(f"❌ {endpoint} failed with status {response.status_code}")
                    results[endpoint] = False
                    
            except Exception as e:
                print(f"❌ {endpoint} error: {e}")
                results[endpoint] = False
        
        all_passed = all(results.values())
        print(f"\n{'✅' if all_passed else '❌'} Resource endpoints summary: {results}")
        return all_passed

    def test_auth_login(self):
        """Test POST /api/auth/login with admin credentials"""
        print("\n=== Testing Auth Login ===")
        try:
            login_data = {
                "email": "admin@digitfellas.com",
                "password": "admin123"
            }
            
            response = self.session.post(f"{API_BASE}/auth/login", json=login_data)
            print(f"Login status: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                print(f"Login response: {data}")
                
                if data.get('ok') and 'user' in data:
                    print("✅ Login successful")
                    
                    # Check for session cookie
                    cookies = response.cookies
                    if 'df_session' in cookies:
                        self.auth_cookie = cookies['df_session']
                        print("✅ Session cookie df_session set")
                        
                        # Update session with cookie for future requests
                        self.session.cookies.update(cookies)
                        return True
                    else:
                        print("❌ Session cookie df_session not set")
                        return False
                else:
                    print(f"❌ Login response missing expected fields: {data}")
                    return False
            else:
                print(f"❌ Login failed with status {response.status_code}")
                try:
                    error_data = response.json()
                    print(f"Error response: {error_data}")
                except:
                    print(f"Error response body: {response.text}")
                return False
                
        except Exception as e:
            print(f"❌ Login error: {e}")
            return False

    def test_auth_me(self):
        """Test GET /api/auth/me with session cookie"""
        print("\n=== Testing Auth Me ===")
        try:
            response = self.session.get(f"{API_BASE}/auth/me")
            print(f"Auth me status: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                print(f"Auth me response: {data}")
                
                if 'user' in data and data['user'] is not None:
                    user = data['user']
                    if user.get('email') == 'admin@digitfellas.com' and user.get('role') == 'admin':
                        print("✅ Auth me returned correct user data")
                        return True
                    else:
                        print(f"❌ Auth me returned incorrect user data: {user}")
                        return False
                else:
                    print(f"❌ Auth me returned no user: {data}")
                    return False
            else:
                print(f"❌ Auth me failed with status {response.status_code}")
                return False
                
        except Exception as e:
            print(f"❌ Auth me error: {e}")
            return False

    def test_protected_site_write_unauthorized(self):
        """Test PUT /api/site without authentication (should fail with 401)"""
        print("\n=== Testing Protected Site Write (Unauthorized) ===")
        try:
            # Create a new session without cookies
            temp_session = requests.Session()
            temp_session.headers.update({
                'Content-Type': 'application/json',
                'User-Agent': 'DigitfellasAPITester/1.0'
            })
            
            test_data = {"brand": {"name": "Test Update"}}
            response = temp_session.put(f"{API_BASE}/site", json=test_data)
            print(f"Unauthorized site update status: {response.status_code}")
            
            if response.status_code == 401:
                print("✅ Site update correctly rejected without authentication")
                return True
            else:
                print(f"❌ Site update should return 401, got {response.status_code}")
                return False
                
        except Exception as e:
            print(f"❌ Unauthorized site update error: {e}")
            return False

    def test_protected_site_write_authorized(self):
        """Test PUT /api/site with authentication (should succeed)"""
        print("\n=== Testing Protected Site Write (Authorized) ===")
        try:
            # First get current site data
            get_response = self.session.get(f"{API_BASE}/site")
            if get_response.status_code != 200:
                print("❌ Could not get current site data")
                return False
                
            current_site = get_response.json()
            
            # Update brand name
            updated_site = current_site.copy()
            updated_site['brand']['name'] = 'Digitfellas Updated'
            
            response = self.session.put(f"{API_BASE}/site", json=updated_site)
            print(f"Authorized site update status: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                if data.get('brand', {}).get('name') == 'Digitfellas Updated':
                    print("✅ Site update successful with authentication")
                    
                    # Restore original name
                    current_site['brand']['name'] = 'Digitfellas'
                    restore_response = self.session.put(f"{API_BASE}/site", json=current_site)
                    if restore_response.status_code == 200:
                        print("✅ Site data restored")
                    
                    return True
                else:
                    print(f"❌ Site update data incorrect: {data.get('brand', {}).get('name')}")
                    return False
            else:
                print(f"❌ Site update failed with status {response.status_code}")
                return False
                
        except Exception as e:
            print(f"❌ Authorized site update error: {e}")
            return False

    def test_uploads_unauthorized(self):
        """Test POST /api/uploads without authentication (should fail with 401)"""
        print("\n=== Testing Uploads (Unauthorized) ===")
        try:
            # Create a new session without cookies
            temp_session = requests.Session()
            temp_session.headers.update({
                'User-Agent': 'DigitfellasAPITester/1.0'
            })
            
            # Create a small test file
            with tempfile.NamedTemporaryFile(mode='w', suffix='.txt', delete=False) as f:
                f.write("Test upload content")
                temp_file_path = f.name
            
            try:
                with open(temp_file_path, 'rb') as f:
                    files = {'files': ('test.txt', f, 'text/plain')}
                    response = temp_session.post(f"{API_BASE}/uploads", files=files)
                    
                print(f"Unauthorized upload status: {response.status_code}")
                
                if response.status_code == 401:
                    print("✅ Upload correctly rejected without authentication")
                    return True
                else:
                    print(f"❌ Upload should return 401, got {response.status_code}")
                    return False
            finally:
                os.unlink(temp_file_path)
                
        except Exception as e:
            print(f"❌ Unauthorized upload error: {e}")
            return False

    def test_uploads_authorized(self):
        """Test POST /api/uploads with authentication (should succeed)"""
        print("\n=== Testing Uploads (Authorized) ===")
        try:
            # Re-login to ensure fresh session
            login_data = {
                "email": "admin@digitfellas.com",
                "password": "admin123"
            }
            
            login_response = self.session.post(f"{API_BASE}/auth/login", json=login_data)
            if login_response.status_code != 200:
                print("❌ Could not login for upload test")
                return False
            
            # Create a small test file
            with tempfile.NamedTemporaryFile(mode='w', suffix='.txt', delete=False) as f:
                f.write("Test upload content for authorized user")
                temp_file_path = f.name
            
            try:
                with open(temp_file_path, 'rb') as f:
                    files = {'files': ('test_authorized.txt', f, 'text/plain')}
                    
                    # Create a new request without the JSON Content-Type header
                    upload_session = requests.Session()
                    upload_session.cookies.update(self.session.cookies)
                    
                    response = upload_session.post(f"{API_BASE}/uploads", files=files)
                    
                print(f"Authorized upload status: {response.status_code}")
                
                if response.status_code == 200:
                    data = response.json()
                    print(f"Upload response: {data}")
                    
                    if 'uploaded' in data and isinstance(data['uploaded'], list) and len(data['uploaded']) > 0:
                        uploaded_file = data['uploaded'][0]
                        if 'url' in uploaded_file and 'id' in uploaded_file:
                            print("✅ Upload successful with authentication")
                            return True
                        else:
                            print(f"❌ Upload response missing expected fields: {uploaded_file}")
                            return False
                    else:
                        print(f"❌ Upload response format incorrect: {data}")
                        return False
                else:
                    print(f"❌ Upload failed with status {response.status_code}")
                    try:
                        error_data = response.json()
                        print(f"Error response: {error_data}")
                    except:
                        print(f"Error response body: {response.text}")
                    return False
            finally:
                os.unlink(temp_file_path)
                
        except Exception as e:
            print(f"❌ Authorized upload error: {e}")
            return False

    def test_auth_logout(self):
        """Test POST /api/auth/logout"""
        print("\n=== Testing Auth Logout ===")
        try:
            response = self.session.post(f"{API_BASE}/auth/logout")
            print(f"Logout status: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                print(f"Logout response: {data}")
                
                if data.get('ok'):
                    print("✅ Logout successful")
                    
                    # Check if cookie is cleared by testing auth/me
                    me_response = self.session.get(f"{API_BASE}/auth/me")
                    if me_response.status_code == 200:
                        me_data = me_response.json()
                        if me_data.get('user') is None:
                            print("✅ Session cookie cleared successfully")
                            return True
                        else:
                            print(f"❌ Session still active after logout: {me_data}")
                            return False
                    else:
                        print(f"❌ Could not verify logout status: {me_response.status_code}")
                        return False
                else:
                    print(f"❌ Logout response incorrect: {data}")
                    return False
            else:
                print(f"❌ Logout failed with status {response.status_code}")
                return False
                
        except Exception as e:
            print(f"❌ Logout error: {e}")
            return False

    def run_all_tests(self):
        """Run all tests in sequence"""
        print(f"Starting API tests for: {API_BASE}")
        print("=" * 60)
        
        results = {}
        
        # Test sequence
        results['health_check'] = self.test_health_check()
        results['site_endpoint'] = self.test_site_endpoint()
        results['resource_endpoints'] = self.test_resource_endpoints()
        results['auth_login'] = self.test_auth_login()
        results['auth_me'] = self.test_auth_me()
        results['protected_write_unauthorized'] = self.test_protected_site_write_unauthorized()
        results['protected_write_authorized'] = self.test_protected_site_write_authorized()
        results['uploads_unauthorized'] = self.test_uploads_unauthorized()
        results['uploads_authorized'] = self.test_uploads_authorized()
        results['auth_logout'] = self.test_auth_logout()
        
        # Summary
        print("\n" + "=" * 60)
        print("TEST SUMMARY")
        print("=" * 60)
        
        passed = 0
        total = len(results)
        
        for test_name, result in results.items():
            status = "✅ PASS" if result else "❌ FAIL"
            print(f"{test_name:<30} {status}")
            if result:
                passed += 1
        
        print(f"\nOverall: {passed}/{total} tests passed")
        
        if passed == total:
            print("🎉 All tests passed!")
            return True
        else:
            print(f"⚠️  {total - passed} tests failed")
            return False

if __name__ == "__main__":
    tester = DigitfellasAPITester()
    success = tester.run_all_tests()
    exit(0 if success else 1)