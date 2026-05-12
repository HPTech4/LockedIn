# CORS Setup for Frontend Integration

## Summary
Backend CORS is configured for `http://localhost:5173` by default (local dev).

## For Frontend Developer

### Local Development (http://localhost:5173)
- Backend automatically allows your frontend at `http://localhost:5173`
- No additional configuration needed
- Test by making a fetch request:

```javascript
fetch('http://localhost:3000/api/auth/signup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'test@example.com', password: 'password123', username: 'testuser' })
})
```

### Production Deployment
- Backend is configured to read the `CORS_ORIGIN` environment variable
- Set it on your deployment platform (Vercel, Netlify, etc.) to your frontend URL:

```
CORS_ORIGIN=https://your-frontend-domain.com
```

For multiple environments (staging + production):
```
CORS_ORIGIN=https://your-frontend-domain.com,https://staging.your-frontend-domain.com
```

## Request Requirements

### Headers
- `Content-Type: application/json` (for JSON requests)
- `Authorization: Bearer <token>` (for protected endpoints)

### Protected Routes (Require Token)
- `GET /api/auth/me`
- `POST /api/auth/logout`
- `GET /api/quotes`
- `POST /api/quotes`
- `DELETE /api/quotes/:id`
- `GET /api/tasks`
- `POST /api/tasks`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`

### Public Routes (No Token Needed)
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /` (health check)

## Example: Login Flow

```javascript
// 1. Login
const loginRes = await fetch('http://localhost:3000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'user@example.com', password: 'password123' })
})
const { token } = await loginRes.json()

// 2. Use token for protected endpoints
const quotesRes = await fetch('http://localhost:3000/api/quotes', {
  method: 'GET',
  headers: { 'Authorization': `Bearer ${token}` }
})
const { quotes } = await quotesRes.json()
```

## Troubleshooting

### Still Getting CORS Error?
1. Check your frontend runs on exactly `http://localhost:5173` (case-sensitive, include port)
2. Verify backend is running (`npm run dev`)
3. Check browser DevTools > Network tab > see request/response headers
4. Ask backend dev to verify `CORS_ORIGIN` is set correctly if deployed

### Backend Errors
If backend crashes or responds with 500, check backend logs (terminal where `npm run dev` runs).
