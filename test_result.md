#====================================================================================================
# START - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================

# THIS SECTION CONTAINS CRITICAL TESTING INSTRUCTIONS FOR BOTH AGENTS
# BOTH MAIN_AGENT AND TESTING_AGENT MUST PRESERVE THIS ENTIRE BLOCK

# Communication Protocol:
# If the `testing_agent` is available, main agent should delegate all testing tasks to it.
#
# You have access to a file called `test_result.md`. This file contains the complete testing state
# and history, and is the primary means of communication between main and the testing agent.
#
# Main and testing agents must follow this exact format to maintain testing data. 
# The testing data must be entered in yaml format Below is the data structure:
# 
## user_problem_statement: {problem_statement}
## backend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.py"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: true
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## frontend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.js"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: true
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## metadata:
##   created_by: "main_agent"
##   version: "1.0"
##   test_sequence: 0
##   run_ui: false
##
## test_plan:
##   current_focus:
##     - "Task name 1"
##     - "Task name 2"
##   stuck_tasks:
##     - "Task name with persistent issues"
##   test_all: false
##   test_priority: "high_first"  # or "sequential" or "stuck_first"
##
## agent_communication:
##     -agent: "main"  # or "testing" or "user"
##     -message: "Communication message between agents"

# Protocol Guidelines for Main agent
#
# 1. Update Test Result File Before Testing:
#    - Main agent must always update the `test_result.md` file before calling the testing agent
#    - Add implementation details to the status_history
#    - Set `needs_retesting` to true for tasks that need testing
#    - Update the `test_plan` section to guide testing priorities
#    - Add a message to `agent_communication` explaining what you've done
#
# 2. Incorporate User Feedback:
#    - When a user provides feedback that something is or isn't working, add this information to the relevant task's status_history
#    - Update the working status based on user feedback
#    - If a user reports an issue with a task that was marked as working, increment the stuck_count
#    - Whenever user reports issue in the app, if we have testing agent and task_result.md file so find the appropriate task for that and append in status_history of that task to contain the user concern and problem as well 
#
# 3. Track Stuck Tasks:
#    - Monitor which tasks have high stuck_count values or where you are fixing same issue again and again, analyze that when you read task_result.md
#    - For persistent issues, use websearch tool to find solutions
#    - Pay special attention to tasks in the stuck_tasks list
#    - When you fix an issue with a stuck task, don't reset the stuck_count until the testing agent confirms it's working
#
# 4. Provide Context to Testing Agent:
#    - When calling the testing agent, provide clear instructions about:
#      - Which tasks need testing (reference the test_plan)
#      - Any authentication details or configuration needed
#      - Specific test scenarios to focus on
#      - Any known issues or edge cases to verify
#
# 5. Call the testing agent with specific instructions referring to test_result.md
#
# IMPORTANT: Main agent must ALWAYS update test_result.md BEFORE calling the testing agent, as it relies on this file to understand what to test next.

#====================================================================================================
# END - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================



#====================================================================================================
# Testing Data - Main Agent and testing sub agent both should log testing data below this section
#====================================================================================================

## user_problem_statement: "Dynamic Digit Fellas-style site for Digitfellas with admin editing; now adding parallax/glassmorphism and switching persistence to PostgreSQL (pg)"
## backend:
##   - task: "Dynamic site API (/api/site, /api/services, /api/projects, /api/blog, /api/navigation, /api/footer)"
##     implemented: true
##     working: "unknown"
##     file: "app/app/api/[[...path]]/route.js"
##     stuck_count: 0
##     priority: "high"
##     needs_retesting: true
##     status_history:
##       - working: "unknown"
##         agent: "main"
##         comment: "Implemented JSON file persistence under /app/data with seed content and endpoints. Needs backend test run."
##       - working: true
##         agent: "testing"
##         comment: "✅ All API endpoints tested successfully: GET /api/site returns JSON with expected keys (brand, navigation, home, pages, footer, _meta). GET /api/services, /api/projects, /api/blog return arrays with 3 items each. GET /api/navigation, /api/footer return objects with correct structure. All endpoints respond with 200 status and valid JSON."
##   - task: "Admin auth + sessions + uploads endpoint"
##     implemented: true
##     working: "unknown"
##     file: "app/app/api/[[...path]]/route.js"
##     stuck_count: 0
##     priority: "high"
##     needs_retesting: true
##     status_history:
##       - working: "unknown"
##         agent: "main"
##         comment: "Email/password login via /api/auth/login, cookie session df_session, protected /api/site PUT and /api/uploads. Needs backend test run."
##       - working: true
##         agent: "testing"
##         comment: "✅ Complete auth flow tested successfully: POST /api/auth/login with admin@digitfellas.com/admin123 returns 200 and sets df_session cookie. GET /api/auth/me returns correct user data when authenticated. POST /api/auth/logout clears session. Protected endpoints: PUT /api/site returns 401 without auth, 200 with auth. POST /api/uploads returns 401 without auth, 200 with auth and successfully uploads files. All security controls working correctly."
## frontend:
##   - task: "Avada-style homepage sections (hero/services/projects/blog/footer)"
##     implemented: true
##     working: "unknown"
##     file: "app/app/page.js"
##     stuck_count: 0
##     priority: "high"
##     needs_retesting: true
##     status_history:
##       - working: "unknown"
##         agent: "main"
##         comment: "Homepage pulls /api/site dynamically and renders sections with reveal animations."
##   - task: "Pages: about, services(+details), projects, blog(+slug), contact"
##     implemented: true
##     working: "unknown"
##     file: "app/app/*/page.js"
##     stuck_count: 0
##     priority: "high"
##     needs_retesting: true
##     status_history:
##       - working: "unknown"
##         agent: "main"
##         comment: "Pages fetch from API endpoints and render cards/detail views."
##   - task: "Admin dashboard UI"
##     implemented: true
##     working: "unknown"
##     file: "app/app/admin/page.js"
##     stuck_count: 0
##     priority: "high"
##     needs_retesting: true
##     status_history:
##       - working: "unknown"
##         agent: "main"
##         comment: "Admin login screen + structured editors + raw JSON + upload UI."
## metadata:
##   created_by: "main_agent"
##   version: "1.0"
##   test_sequence: 0
##   run_ui: false
## test_plan:
##   current_focus:
##     - "Dynamic site API (/api/site, /api/services, /api/projects, /api/blog, /api/navigation, /api/footer)"
##     - "Admin auth + sessions + uploads endpoint"
##   stuck_tasks: []
##   test_all: false
##   test_priority: "high_first"
## agent_communication:
##   - agent: "main"
##     message: "Implemented JSON persistence MVP replacing Mongo template. Added dynamic pages and admin dashboard. Ready for backend testing of API, auth, upload, and site update."
##   - agent: "testing"
##     message: "✅ Backend testing completed successfully. All 10 critical tests passed: 1) Health check API working 2) GET /api/site returns JSON with all expected keys 3) All resource endpoints (/api/services, /api/projects, /api/blog, /api/navigation, /api/footer) return valid JSON 4) Auth login with admin@digitfellas.com/admin123 works and sets df_session cookie 5) GET /api/auth/me returns user data when authenticated 6) Protected PUT /api/site correctly rejects unauthorized requests (401) and accepts authorized requests (200) 7) Protected POST /api/uploads correctly rejects unauthorized requests (401) and accepts authorized file uploads (200) 8) POST /api/auth/logout clears session successfully. Backend API is fully functional and secure."

##   - agent: "main"
##     message: "Enhancement: added parallax + glassmorphism tweaks on homepage. Added PostgreSQL support via pg (df_site, df_users tables) and switched API storage to postgres when DATABASE_URL is present. Next.js restarted after adding DATABASE_URL/AUTH_SECRET to /app/.env. Needs backend retesting under postgres mode."