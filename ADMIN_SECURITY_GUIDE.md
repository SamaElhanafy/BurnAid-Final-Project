# Admin Panel Security Implementation Guide

## Overview
This document explains the complete backend authentication and authorization system for the BURN-AID admin panel.

---

## Authentication System

### User Registration & Login

**Registration Endpoint:**
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

Response (201):
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-here",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

**Login Endpoint:**
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response (200):
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-here",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

### Authentication Flow

1. **User enters email & password** on login page
2. **Frontend sends to `/api/auth/login`**
3. **Backend validates credentials:**
   - Email exists in database
   - Password matches hashed password (bcrypt)
4. **Backend generates JWT token** with 7-day expiration
5. **Frontend stores token in session state**
6. **Token is sent with all protected requests:**
   ```
   Authorization: Bearer <token>
   ```

### Password Security

- **Hashing Algorithm:** bcrypt (10 rounds)
- **Storage:** Password hashes only, never plain text
- **Verification:** bcrypt.compare() on login

**Example hash for "Admin123!":**
```
$2b$10$8m5k7C9X3nL0P4qR5sT6uOvWx1yZ2aB3cD4eF5gH6iJ7kL8mN9oP0q
```

---

## Authorization System

### User Roles

Two roles are supported:

| Role | Permissions | Access |
|------|------------|--------|
| **admin** | View & edit videos, view users, view datasets | Admin panel |
| **user** | View burn assessments, manage profile | User dashboard |

### Admin Middleware

Every admin-protected endpoint requires:

1. **Authentication Check** (authMiddleware)
   ```typescript
   const header = req.header('authorization') ?? '';
   const token = header.startsWith('Bearer ') ? header.slice('Bearer '.length) : '';
   if (!token) return res.status(401).json({ error: 'Missing token' });
   // Verify JWT signature
   const payload = jwt.verify(token, JWT_SECRET_KEY);
   req.userId = payload.sub;
   ```

2. **Admin Role Check** (adminMiddleware)
   ```typescript
   const users = await readUsers();
   const user = users.find((u) => u.id === userId);
   if (user?.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });
   ```

### API Authorization

**Protected Admin Routes:**
```
GET    /api/admin/users               ✅ List users
GET    /api/admin/datasets            ✅ View datasets (read-only)
GET    /api/admin/videos              ✅ List videos
POST   /api/admin/videos              ✅ Create video
PUT    /api/admin/videos/:id          ✅ Update video
DELETE /api/admin/videos/:id          ✅ Delete video
GET    /api/admin/how-it-works-video  ✅ Get how-it-works video
PUT    /api/admin/how-it-works-video  ✅ Update how-it-works video
GET    /api/admin/logs                ✅ View system logs
```

**Dataset endpoints - DISABLED:**
```
POST   /api/admin/datasets            ❌ REMOVED
PUT    /api/admin/datasets/:id        ❌ REMOVED
DELETE /api/admin/datasets/:id        ❌ REMOVED
```

---

## Frontend Security

### Admin Panel Access Control

**1. Authentication Check:**
```typescript
if (!authUser) {
  // Show login required message
  // Button to navigate to login
}
```

**2. Admin Role Check:**
```typescript
if (authUser.role !== 'admin') {
  // Show "Admin Access Required" error
  // Button to go back
}
```

**3. Admin Actions:**
- Save Video: Requires JWT token + admin role
- Fetch Users: Requires JWT token + admin role
- View Datasets: Requires JWT token + admin role

### Protected API Calls

All admin operations include JWT token:

```typescript
const resp = await fetch(`${backendUrl}/api/admin/videos`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${authToken}`, // ← Required!
  },
  body: JSON.stringify({ ... })
});

if (resp.status === 401) {
  // Token invalid/expired - redirect to login
  setView('login');
}
if (resp.status === 403) {
  // User not admin - show error
}
```

---

## Database Structure

### Users Table (backend/data/users.json)

```json
{
  "id": "uuid",
  "name": "Admin User",
  "email": "admin@example.com",
  "passwordHash": "$2b$10$...",
  "role": "admin",
  "createdAt": "2026-05-04T00:00:00.000Z",
  "phone": "+1-555-0100",
  "bloodType": "O+",
  "allergies": "None",
  "medications": "None"
}
```

**Fields:**
- `id`: UUID (auto-generated on registration)
- `name`: User's full name
- `email`: Unique email address
- `passwordHash`: bcrypt hash (10 rounds)
- `role`: "admin" or "user"
- `createdAt`: ISO timestamp
- `phone`, `bloodType`, `allergies`, `medications`: Optional profile fields

### Videos Table (backend/data/videos.json)

```json
{
  "id": "uuid",
  "title": "Video Title",
  "sub": "15 min",
  "thumbnail": "https://...",
  "videoUrl": "https://...",
  "createdAt": "2026-05-04T...",
  "updatedAt": "2026-05-04T..."
}
```

### How It Works Video (backend/data/howItWorksVideo.json)

```json
{
  "thumbnail": "https://...",
  "videoUrl": "https://...",
  "updatedAt": "2026-05-04T..."
}
```

---

## Seed Data

### Default Admin Account

```
Email:    admin@example.com
Password: (use your own - register via UI)
Role:     admin
```

### Default User Account

```
Email:    user@example.com
Password: (use your own - register via UI)
Role:     user
```

**To create admin accounts:**
1. Register via normal signup
2. Manually edit users.json to set `role: "admin"` (admin-only action)
3. Or provide admin credentials during initial setup

---

## Security Best Practices Implemented

✅ **Password Security**
- Bcrypt hashing with 10 rounds
- Plain text passwords never stored or logged
- Passwords validated on login

✅ **Token Security**
- JWT tokens with 7-day expiration
- Tokens verified on every protected request
- Tokens not exposed in logs or responses

✅ **Access Control**
- Role-based authorization (admin/user)
- Backend enforces permissions (not frontend)
- All protected endpoints require both auth + admin role

✅ **Input Validation**
- Zod schema validation on all inputs
- Email format validation
- Password length validation
- URL validation for videos

✅ **API Security**
- CORS enabled for frontend origin
- 1MB request size limit
- Proper HTTP status codes (401, 403, 404)
- Error messages don't leak sensitive info

✅ **Frontend Security**
- Auth checks before showing admin panel
- Tokens sent only to secure endpoints
- User data filtered (passwordHash never exposed)
- Logout clears token

---

## Testing Security

### Test Case 1: Not Logged In
```
1. Open admin panel without logging in
2. Expected: "Please log in first" message
3. Redirect to login
```

### Test Case 2: Non-Admin User
```
1. Register as regular user
2. Try to access admin panel
3. Expected: "Admin Access Required" message
4. Cannot see admin controls
```

### Test Case 3: Admin User
```
1. Register with admin role
2. Access admin panel
3. Expected: Full panel visible
4. Can edit videos and users
```

### Test Case 4: Manual API Call by Non-Admin
```
curl -X POST http://localhost:3002/api/admin/videos \
  -H "Authorization: Bearer USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"test"}'

Expected Response (403):
{
  "error": "Admin access required"
}
```

### Test Case 5: Invalid Token
```
curl -X GET http://localhost:3002/api/admin/videos \
  -H "Authorization: Bearer invalid-token"

Expected Response (401):
{
  "error": "Invalid token"
}
```

### Test Case 6: Dataset Editing Disabled
```
curl -X POST http://localhost:3002/api/admin/datasets \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -d '{"name":"test"}'

Expected Response (404):
Route not found - endpoint removed
```

---

## Deployment Checklist

- [ ] Set `AUTH_JWT_SECRET` to a long random string (min 32 chars)
- [ ] Set `NODE_ENV=production`
- [ ] Use HTTPS for all endpoints
- [ ] Enable CORS only for trusted origins
- [ ] Store JWT_SECRET in environment variables (not code)
- [ ] Set secure cookie flags if using cookies
- [ ] Regular security audits of role assignments
- [ ] Monitor system logs for failed auth attempts
- [ ] Implement rate limiting on login endpoint
- [ ] Use HTTPS for all password transmission

---

## Troubleshooting

### "Admin access required" error when admin logs in

**Solution:**
1. Check user.role in users.json is "admin"
2. Verify authUser.role is being read correctly
3. Clear browser cache and re-login

### Videos not saving to backend

**Solution:**
1. Check Authorization header is being sent
2. Verify JWT token is valid (check expiration)
3. Check backend logs for errors
4. Verify videos store is writable

### "Missing token" error

**Solution:**
1. Make sure user is logged in
2. Check Authorization header format: `Bearer <token>`
3. Ensure token is not expired (7-day expiration)
4. Re-login to get fresh token

### Dataset delete button still appears

**Solution:**
1. Check frontend code - delete button should be removed
2. Hard refresh browser (Ctrl+Shift+R)
3. Check network tab to ensure DELETE endpoint returns 404

---

## Files Modified

```
backend/
├── server.ts (added video routes, removed dataset POST/PUT/DELETE)
├── storage/
│   └── videosStore.ts (new)
├── data/
│   └── users.json (standardized to use 'role' field)

src/
├── App.tsx
│   ├── Added admin role check in AdminPortalView
│   ├── Updated video save to backend
│   ├── Removed dataset delete button
│   ├── Updated admin users type to use role

.env.example (updated with security notes)
```

---

## Next Steps

1. Test all security scenarios
2. Create admin user account via registration
3. Test video editing with backend persistence
4. Verify non-admins cannot access admin APIs
5. Monitor logs for security issues
6. Plan admin account recovery process
7. Set up alerts for failed auth attempts
