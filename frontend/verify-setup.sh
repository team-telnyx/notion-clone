#!/bin/bash
set -e

echo "=== Frontend Initialization Verification Tests ==="
echo ""

GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

PASS=0
FAIL=0

pass() {
    echo -e "${GREEN}[PASS]${NC} $1"
    ((PASS++))
}

fail() {
    echo -e "${RED}[FAIL]${NC} $1"
    ((FAIL++))
}

echo "Testing AC-1: Vite Project Structure"
if [ -f "package.json" ]; then
    pass "package.json exists"
    if grep -q "vite" package.json; then
        pass "Vite dependency found"
    else
        fail "Vite dependency not found in package.json"
    fi
else
    fail "package.json not found"
fi

if [ -f "vite.config.ts" ]; then
    pass "vite.config.ts exists"
else
    fail "vite.config.ts not found"
fi

if [ -f "tsconfig.json" ]; then
    pass "tsconfig.json exists"
else
    fail "tsconfig.json not found"
fi

echo ""
echo "Testing AC-2: React Router Configuration"
if [ -f "src/App.tsx" ]; then
    pass "App.tsx exists"
    if grep -q "BrowserRouter" src/App.tsx; then
        pass "BrowserRouter found in App.tsx"
    else
        fail "BrowserRouter not found in App.tsx"
    fi
    if grep -q 'Routes' src/App.tsx; then
        pass "Routes component found"
    else
        fail "Routes component not found"
    fi
    if grep -q 'path="/login"' src/App.tsx; then
        pass "Login route defined"
    else
        fail "Login route not defined"
    fi
    if grep -q 'path="/register"' src/App.tsx; then
        pass "Register route defined"
    else
        fail "Register route not defined"
    fi
    if grep -q 'path="/dashboard"' src/App.tsx; then
        pass "Dashboard route defined"
    else
        fail "Dashboard route not defined"
    fi
else
    fail "App.tsx not found"
fi

if grep -q '"react-router-dom"' package.json; then
    pass "react-router-dom in dependencies"
else
    fail "react-router-dom not in dependencies"
fi

echo ""
echo "Testing AC-3: Tailwind CSS Configuration"
if [ -f "tailwind.config.js" ]; then
    pass "tailwind.config.js exists"
    if grep -q "content:" tailwind.config.js; then
        pass "Content paths configured in tailwind.config.js"
    else
        fail "Content paths missing"
    fi
    if grep -q '"./src/\*\*/\*.{js,ts,jsx,tsx}"' tailwind.config.js; then
        pass "Tailwind content includes src files"
    else
        fail "Tailwind content missing src files"
    fi
else
    fail "tailwind.config.js not found"
fi

if [ -f "postcss.config.js" ]; then
    pass "postcss.config.js exists"
else
    fail "postcss.config.js not found"
fi

if [ -f "src/index.css" ]; then
    pass "src/index.css exists"
    if grep -q "@import.*tailwindcss" src/index.css || grep -q "@tailwind base" src/index.css; then
        pass "Tailwind CSS import found"
    else
        fail "Tailwind CSS import missing"
    fi
else
    fail "src/index.css not found"
fi

if grep -q '"tailwindcss"' package.json; then
    pass "tailwindcss in dependencies"
else
    fail "tailwindcss not in dependencies"
fi

echo ""
echo "Testing AC-4: Axios Configuration with Auth Interceptors"
if [ -f "src/api/axios.ts" ]; then
    pass "src/api/axios.ts exists"
    if grep -q "interceptors.request" src/api/axios.ts; then
        pass "Request interceptor found"
    else
        fail "Request interceptor missing"
    fi
    if grep -q "interceptors.response" src/api/axios.ts; then
        pass "Response interceptor found"
    else
        fail "Response interceptor missing"
    fi
    if grep -q "localStorage.getItem('token')" src/api/axios.ts; then
        pass "Token retrieval from localStorage found"
    else
        fail "Token retrieval logic missing"
    fi
    if grep -q "Authorization" src/api/axios.ts && grep -q "Bearer" src/api/axios.ts; then
        pass "Bearer token header configuration found"
    else
        fail "Bearer token header configuration missing"
    fi
    if grep -q "error.response?.status === 401" src/api/axios.ts; then
        pass "401 error handling found"
    else
        fail "401 error handling missing"
    fi
else
    fail "src/api/axios.ts not found"
fi

if grep -q '"axios"' package.json; then
    pass "axios in dependencies"
else
    fail "axios not in dependencies"
fi

echo ""
echo "Testing AC-5: useAuth Hook Exports"
if [ -f "src/hooks/useAuth.ts" ]; then
    pass "src/hooks/useAuth.ts exists"
    if grep -q "export function useAuth" src/hooks/useAuth.ts; then
        pass "useAuth function exported"
    else
        fail "useAuth function not exported"
    fi
    if grep -q "interface User" src/hooks/useAuth.ts; then
        pass "User interface defined"
    else
        fail "User interface not defined"
    fi
    if grep -q "useState<User" src/hooks/useAuth.ts; then
        pass "User state typed correctly"
    else
        fail "User state typing missing"
    fi
    if grep -q "const login" src/hooks/useAuth.ts; then
        pass "login method defined"
    else
        fail "login method missing"
    fi
    if grep -q "const register" src/hooks/useAuth.ts; then
        pass "register method defined"
    else
        fail "register method missing"
    fi
    if grep -q "const logout" src/hooks/useAuth.ts; then
        pass "logout method defined"
    else
        fail "logout method missing"
    fi
    if grep -q "return.*user.*loading.*login.*register.*logout" src/hooks/useAuth.ts; then
        pass "Correct hook return values"
    else
        fail "Hook return values incorrect"
    fi
else
    fail "src/hooks/useAuth.ts not found"
fi

echo ""
echo "Testing AC-6: Protected Routes"
if [ -f "src/App.tsx" ]; then
    if grep -q "ProtectedRoute" src/App.tsx; then
        pass "ProtectedRoute component used"
    else
        fail "ProtectedRoute component not used"
    fi
    if grep -q 'useAuth()' src/App.tsx; then
        pass "useAuth hook used in routing"
    else
        fail "useAuth hook not used in routing"
    fi
    if grep -q 'Navigate to="/login"' src/App.tsx; then
        pass "Redirect to /login configured"
    else
        fail "Redirect to /login not configured"
    fi
fi

echo ""
echo "Testing Page Component existence"
page_files=("src/pages/Login.tsx" "src/pages/Register.tsx" "src/pages/Dashboard.tsx" "src/pages/Workspace.tsx")
for page in "${page_files[@]}"; do
    if [ -f "$page" ]; then
        pass "$page exists"
        if grep -q "export default" "$page"; then
            pass "$page has default export"
        else
            fail "$page missing default export"
        fi
    else
        fail "$page not found"
    fi
done

echo ""
echo "Testing Environment Configuration"
if [ -f ".env" ]; then
    pass ".env exists"
    if grep -q "VITE_API_URL" .env; then
        pass "VITE_API_URL defined in .env"
    else
        fail "VITE_API_URL missing from .env"
    fi
else
    fail ".env not found"
fi

if [ -f ".env.example" ]; then
    pass ".env.example exists"
else
    fail ".env.example not found"
fi

echo ""
echo "Testing index.html Configuration"
if [ -f "index.html" ]; then
    if grep -q "<title>Notion Clone</title>" index.html; then
        pass "HTML title set to 'Notion Clone'"
    else
        fail "HTML title not set correctly"
    fi
else
    fail "index.html not found"
fi

echo ""
echo "=========================================="
echo "Test Summary: $PASS passed, $FAIL failed"
if [ $FAIL -eq 0 ]; then
    echo -e "${GREEN}All tests passed!${NC}"
    exit 0
else
    echo -e "${RED}Some tests failed!${NC}"
    exit 1
fi
