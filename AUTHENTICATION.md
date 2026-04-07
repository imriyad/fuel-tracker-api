# Authentication System

## Authentication Method Used

This application uses **JWT (JSON Web Token) Authentication** with the following process:

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



## Authentication Flow

### 1. **User Registration**
```
User submits form → Backend validates → Hash password with bcrypt → Store in PostgreSQL → Return JWT token
```

### 2. **User Login**
```
User enters credentials → Backend validates → Compare with bcrypt hash → Generate JWT token → Return token
```

### 3. **Authenticated Requests**
```
Frontend sends request → Include JWT in Authorization header → Backend validates token → Allow access to protected routes
```

---

## Technical Details

### **JWT Token Configuration**
- **Algorithm**: HS256
- **Expiration**: 30 days
- **Payload**: Contains user ID
- **Secret Key**: Stored in environment variable (JWT_SECRET)

### **Password Security**
- **Hashing**: bcrypt with 10 salt rounds
- **Storage**: Hashed passwords stored in PostgreSQL
- **Comparison**: Passwords compared using bcrypt.compare()

### **Token Storage**
- **Client-side**: Stored in localStorage as `fuel_user`
- **Server-side**: Token sent in `Authorization: Bearer <token>` header
- **Auto-injection**: Axios interceptors automatically add token to requests

### **Authentication Middleware**
- **protect()**: Validates JWT token and attaches user to request
- **authorize(...roles)**: Checks if user has required role(s)
- **PublicOnly**: React Router guard for public routes (login, register)

---

## API Endpoints

### Public Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login existing user

### Protected Endpoints (Requires JWT)
- `GET /api/stations` - Get all stations
- `POST /api/stations` - Create station (admin only)
- `PUT /api/stations/:id` - Update station (admin only)
- `DELETE /api/stations/:id` - Delete station (admin only)

---

## User Roles

- **user**: Default role, can view stations
- **admin**: Can add, edit, and delete stations

---

## Frontend Implementation

### AuthContext
```typescript
const { user, isAuthenticated, isAdmin, login, logout } = useAuth();
```

### Login Example
```typescript
const response = await authApi.login({ email, password });
login(response.data); // Saves user and token to localStorage
navigate('/');
```

### Protected Route Example
```typescript
// Token automatically sent via Axios interceptor
const response = await stationApi.getAll();
```

---

## Security Features

✅ Passwords hashed with bcrypt (10 salt rounds)
✅ JWT token authentication
✅ Token expiration (30 days)
✅ Protected routes with middleware
✅ Role-based authorization
✅ Input validation
✅ Error handling with proper status codes

---

**Version**: 1.0.0 | **Last Updated**: April 7, 2026

---

## Backend Implementation

### 1. Authentication Controller

**Location**: `fuel-tracker-api/src/controllers/authController.js`

#### Register User

```javascript
POST /api/auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- `400 Bad Request` - Missing required fields
- `400 Bad Request` - User already exists
- `500 Internal Server Error` - Server error

#### Login User

```javascript
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- `400 Bad Request` - Missing required fields
- `401 Unauthorized` - Invalid email or password
- `500 Internal Server Error` - Server error

### 2. Authentication Middleware

**Location**: `fuel-tracker-api/src/middlewares/auth.js`

#### Protect Route

Protects routes that require authentication. The user must provide a valid JWT token.

```javascript
const protect = async (req, res, next) => {
  // Extracts and validates JWT token
  // Attaches user to req.user
  // Calls next() or returns 401
};
```

**Usage:**
```javascript
router.get('/protected', protect, (req, res) => {
  res.json({ message: 'Protected data', user: req.user });
});
```

#### Authorize Roles

Checks if authenticated user has required role(s).

```javascript
const authorize = (...roles) => {
  // Checks if req.user.role is in allowed roles
  // Returns 403 if unauthorized
};
```

**Usage:**
```javascript
router.post('/admin-only', protect, authorize('admin'), (req, res) => {
  res.json({ message: 'Admin only endpoint' });
});
```

### 3. Authentication Routes

**Location**: `fuel-tracker-api/src/routes/authRoutes.js`

```javascript
POST /api/auth/register - Register new user
POST /api/auth/login    - Login existing user
```

---

## Frontend Implementation

### 1. Authentication Context

**Location**: `fuel-tracker-client/src/context/AuthContext.tsx`

Provides authentication state and methods to all components.

#### Available Values

```typescript
interface AuthContextType {
  user: User | null;           // Current logged-in user
  loading: boolean;            // Authentication loading state
  login: (userData: User) => void;
  logout: () => void;
  isAuthenticated: boolean;    // Boolean flag
  isAdmin: boolean;            // Admin role check
}
```

#### User Interface

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin';
  token: string;
}
```

#### Usage Example

```typescript
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, logout, isAdmin } = useAuth();

  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  return (
    <div>
      <h1>Welcome, {user?.name}!</h1>
      {isAdmin && <button>Delete Station</button>}
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### 2. Login Page

**Location**: `fuel-tracker-client/src/pages/Login.tsx`

**Features:**
- Email and password input
- Form validation
- Error handling
- Loading state
- Auto-redirect on success
- Link to registration

**Usage:**
```typescript
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api/apiService';

const { login } = useAuth();
const navigate = useNavigate();

const handleLogin = async (email, password) => {
  const response = await authApi.login({ email, password });
  login(response.data);
  navigate('/');
};
```

### 3. Register Page

**Location**: `fuel-tracker-client/src/pages/Register.tsx`

**Features:**
- Name, email, password, confirm password fields
- Password matching validation
- Form validation
- Error handling
- Auto-login after registration
- Redirect to dashboard

### 4. API Service

**Location**: `fuel-tracker-client/src/api/apiService.ts`

#### Auth API Methods

```typescript
// Login
const response = await authApi.login({ 
  email: 'user@example.com', 
  password: 'password123' 
});

// Register
const response = await authApi.register({ 
  name: 'John Doe',
  email: 'user@example.com', 
  password: 'password123' 
});
```

### 5. Router Guards

**Location**: `fuel-tracker-client/src/context/Router.tsx`

#### PublicOnly Guard

Protects public routes (login, register) from authenticated users.

```typescript
const PublicOnly = () => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) return null;
  if (isAuthenticated) return <Navigate to="/" replace />;
  
  return <Outlet />;
};
```

#### Route Configuration

```typescript
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Dashboard />, // Protected (future: add AuthGuard)
      },
    ],
  },
  {
    element: <PublicOnly />, // Public routes
    children: [
      { path: '/login', element: <Login /> },
      { path: '/register', element: <Register /> },
    ]
  },
]);
```

---

## Database Schema

### Users Table

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

### Roles

- **`user`** - Default role, can view stations
- **`admin`** - Can add/edit/delete stations

### Initialize Database

Run the initialization script:

```bash
cd fuel-tracker-api
node src/scripts/init-db.js
```

---

## API Endpoints

### Public Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login existing user | No |
| GET | `/api/health` | Health check | No |

### Protected Endpoints

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/api/stations` | Get all stations | Yes | user |
| POST | `/api/stations` | Create station | Yes | admin |
| PUT | `/api/stations/:id` | Update station | Yes | admin |
| DELETE | `/api/stations/:id` | Delete station | Yes | admin |

---

## Security Features

### 1. Password Hashing

- **Algorithm**: bcrypt
- **Salt Rounds**: 10
- **Implementation**: Passwords are hashed before storing in database

```javascript
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(password, salt);
```

### 2. JWT Token Authentication

- **Algorithm**: HS256
- **Expiration**: 30 days
- **Secret**: Environment variable (JWT_SECRET)
- **Payload**: User ID

```javascript
const token = jwt.sign(
  { id: user.id }, 
  process.env.JWT_SECRET, 
  { expiresIn: '30d' }
);
```

### 3. Protected Routes

Middleware validates JWT token before allowing access to protected endpoints.

```javascript
router.get('/protected', protect, (req, res) => {
  // Only accessible with valid token
});
```

### 4. Role-Based Access Control

Authorization middleware checks user roles before allowing access.

```javascript
router.post('/admin', protect, authorize('admin'), (req, res) => {
  // Only accessible by admin users
});
```

### 5. Input Validation

Server-side validation for all inputs:
- Required fields
- Email format
- Password complexity (can be enhanced)

### 6. Error Handling

Proper HTTP status codes:
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Invalid credentials/token
- `403 Forbidden` - Insufficient permissions
- `500 Internal Server Error` - Server errors

---

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### 1. Backend Setup

```bash
# Navigate to backend directory
cd fuel-tracker-api

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env and add your values
# JWT_SECRET=your_secret_key_here
# DATABASE_URL=postgresql://username:password@localhost:5432/fuel_tracker

# Initialize database
node src/scripts/init-db.js

# Start development server
npm run dev
```

Backend will run on: `http://localhost:3000`

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd fuel-tracker-client

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run on: `http://localhost:5173`

### 3. Environment Variables

#### Backend (.env)

```env
# Server
PORT=3000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://username:password@localhost:5432/fuel_tracker

# JWT
JWT_SECRET=your_super_secret_key_here_change_this_in_production
```

#### Frontend (.env)

```env
# API Base URL (defaults to http://localhost:3000/api)
VITE_API_URL=http://localhost:3000/api
```

---

## Usage Examples

### Example 1: Register a New User

**Request:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "password": "securePassword123"
  }'
```

**Response:**
```json
{
  "id": 2,
  "name": "Alice Johnson",
  "email": "alice@example.com",
  "role": "user",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Example 2: Login

**Request:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@example.com",
    "password": "securePassword123"
  }'
```

**Response:**
```json
{
  "id": 2,
  "name": "Alice Johnson",
  "email": "alice@example.com",
  "role": "user",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Example 3: Access Protected Route

**Request:**
```bash
curl -X GET http://localhost:3000/api/stations \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response:**
```json
{
  "data": [
    { "id": 1, "name": "Station A", "location": "Downtown" },
    { "id": 2, "name": "Station B", "location": "Uptown" }
  ]
}
```

### Example 4: Frontend Usage

```typescript
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api/apiService';
import { useNavigate } from 'react-router-dom';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await authApi.login({ email, password });
      login(response.data); // Save to context and localStorage
      navigate('/'); // Redirect to dashboard
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="email" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input 
        type="password" 
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit">Login</button>
    </form>
  );
}
```

---

## Troubleshooting

### Common Issues

#### 1. "Not authorized to access this route"

**Cause:** Missing or invalid JWT token.

**Solution:**
- Ensure you're logged in
- Check that the token is being sent in the `Authorization` header
- Verify token hasn't expired (30 days)
- Clear localStorage and log in again

#### 2. "User already exists"

**Cause:** Attempting to register with an email that's already registered.

**Solution:**
- Log in with existing credentials
- Or use a different email address

#### 3. "Invalid email or password"

**Cause:** Incorrect credentials.

**Solution:**
- Verify email and password are correct
- Check for extra spaces
- Ensure password matches exactly
- Try resetting password (if feature available)

#### 4. CORS Errors

**Cause:** Frontend and backend on different ports/domains.

**Solution:**
- Ensure backend CORS is configured correctly
- Check `.env` API URL in frontend
- Verify backend is running

#### 5. Database Connection Errors

**Cause:** Database not running or connection string incorrect.

**Solution:**
```bash
# Check PostgreSQL is running
pg_isready

# Verify connection string in .env
# Run database initialization script
node src/scripts/init-db.js
```

#### 6. Token Not Persisting

**Cause:** localStorage disabled or cleared.

**Solution:**
- Ensure localStorage is enabled in browser
- Check browser privacy settings
- Clear cookies and try again

### Debug Mode

Enable detailed logging:

**Backend:**
```javascript
// In controllers/middlewares
console.log('Auth debug:', { userId, email, role });
```

**Frontend:**
```typescript
// In components
console.log('Auth state:', { user, isAuthenticated, isAdmin });
```

---

## Best Practices

### For Developers

1. **Never commit secrets to version control**
   - Use `.env` files
   - Add `.env` to `.gitignore`

2. **Use strong JWT secrets**
   ```bash
   # Generate a secure secret
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

3. **Implement password validation**
   - Minimum 8 characters
   - Require uppercase, lowercase, numbers, special characters

4. **Use HTTPS in production**
   - Never send tokens over HTTP
   - Configure SSL certificates

5. **Implement rate limiting**
   - Prevent brute force attacks
   - Limit login attempts

6. **Add password reset functionality**
   - Email-based password reset
   - Token-based reset links

7. **Implement refresh tokens**
   - Short-lived access tokens (15 minutes)
   - Long-lived refresh tokens (7 days)
   - Automatic token refresh

### For Users

1. **Use strong, unique passwords**
2. **Don't share your JWT token**
3. **Log out from shared devices**
4. **Keep your email secure**
5. **Report suspicious activity**

---

## Future Enhancements

- [ ] Password reset via email
- [ ] Email verification on registration
- [ ] Two-factor authentication (2FA)
- [ ] Social login (Google, GitHub)
- [ ] Refresh token mechanism
- [ ] Rate limiting for login attempts
- [ ] Account lockout after failed attempts
- [ ] Password strength meter
- [ ] Remember me functionality
- [ ] Session timeout warning
- [ ] Audit logging for user actions

---

## Additional Resources

- [React Router Documentation](https://reactrouter.com/)
- [JWT.io](https://jwt.io/)
- [Bcrypt Documentation](https://www.npmjs.com/package/bcrypt)
- [Express.js Documentation](https://expressjs.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

---

## Support

For issues or questions related to authentication:
1. Check this documentation
2. Review the troubleshooting section
3. Check browser console for errors
4. Check server logs for backend errors
5. Open an issue in the project repository

---

**Last Updated:** April 7, 2026

**Version:** 1.0.0