## __Backend (API) - fuel-tracker-api__

### __1. Authentication Controller__

__File:__ `src/controllers/authController.js`

__Features:__

- __Register Endpoint__ (`POST /api/auth/register`)

  - Validates required fields (name, email, password)
  - Checks if user already exists
  - Hashes password using bcrypt (10 salt rounds)
  - Creates user in PostgreSQL database
  - Returns JWT token with 30-day expiration
  - Default role: 'user'

- __Login Endpoint__ (`POST /api/auth/login`)

  - Validates email and password
  - Compares hashed password using bcrypt
  - Generates JWT token on successful authentication
  - Returns user data with token

__Security:__

- Passwords hashed with bcrypt
- JWT tokens with 30-day expiration
- Environment-based JWT secret key

### __2. Authentication Middleware__

__File:__ `src/middlewares/auth.js`

__Functions:__

- __`protect`__ - Verifies JWT token and attaches user to request

  - Extracts token from `Authorization: Bearer <token>` header
  - Verifies token signature
  - Fetches user from database
  - Returns 401 if token is invalid or user not found

- __`authorize(...roles)`__ - Role-based access control

  - Checks if user has required role(s)
  - Returns 403 if unauthorized
  - Example usage: `authorize('admin')`

### __3. Authentication Routes__

__File:__ `src/routes/authRoutes.js`

```javascript
POST /api/auth/register - Register new user
POST /api/auth/login    - Login existing user
```

---

## __Frontend (Client) - fuel-tracker-client__

### __1. Authentication Context__

__File:__ `src/context/AuthContext.tsx`

__Provides:__

- `user` - Current logged-in user object
- `loading` - Authentication loading state
- `login(userData)` - Log user in and save to localStorage
- `logout()` - Clear user data and localStorage
- `isAuthenticated` - Boolean flag
- `isAdmin` - Boolean flag for admin access

__Features:__

- Persists user session in localStorage
- Automatically restores session on app load
- Sets Axios Authorization header with Bearer token
- Clears token on logout

### __2. Login Page__

__File:__ `src/pages/Login.tsx`

__Features:__

- Email and password form
- Form validation
- Error handling and display
- Loading state during API call
- Redirects to dashboard on success
- Link to registration page

### __3. Register Page__

__File:__ `src/pages/Register.tsx`

__Features:__

- Full name, email, password, confirm password fields
- Password matching validation
- Form validation
- Error handling
- Loading state
- Auto-login after registration
- Redirects to dashboard
- Link to login page

### __4. API Service__

__File:__ `src/api/apiService.ts`

__Auth API:__

```typescript
authApi.login({ email, password })
authApi.register({ name, email, password })
```

__Base Configuration:__

- Base URL: `http://localhost:3000/api`
- Content-Type: `application/json`
- Authorization header automatically set from AuthContext

### __5. Router Guards__

__File:__ `src/context/Router.tsx`

__`PublicOnly` Guard:__

- Protects `/login` and `/register` routes
- Redirects authenticated users to `/`
- Shows loading state during auth check

__Route Configuration:__

```typescript
/ (Dashboard) - Protected by Layout (future: AuthGuard)
/login - Public only
/register - Public only
```

---

## __Database Schema__

__Users Table:__

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## __User Roles__

- __`user`__ - Default role, can view stations
- __`admin`__ - Can add/edit/delete stations (checked in Dashboard)

---

## __Security Best Practices Implemented__

1. ✅ Password hashing with bcrypt (10 salt rounds)
2. ✅ JWT token authentication
3. ✅ Token expiration (30 days)
4. ✅ Protected routes with middleware
5. ✅ Role-based authorization
6. ✅ Input validation on backend
7. ✅ Error handling with proper status codes
8. ✅ Secure token storage in localStorage
9. ✅ Automatic token injection in API requests
10. ✅ Session persistence across page reloads

---

## __Authentication Flow__

__Login:__

1. User enters credentials → Login page
2. Frontend sends POST to `/api/auth/login`
3. Backend validates credentials
4. Backend generates JWT token
5. Frontend stores user + token in localStorage
6. Frontend redirects to dashboard
7. All subsequent requests include `Authorization: Bearer <token>`

__Registration:__

1. User fills form → Register page
2. Frontend sends POST to `/api/auth/register`
3. Backend checks if user exists
4. Backend hashes password and creates user
5. Backend generates JWT token
6. Frontend auto-logs user in
7. Frontend redirects to dashboard

__Logout:__

1. User logs out
2. Frontend clears localStorage
3. Frontend clears Axios Authorization header
4. User is redirected to login (if accessing protected routes)
