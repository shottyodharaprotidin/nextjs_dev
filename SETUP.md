# Shotyodhara Protidin - Next.js Frontend Setup Guide

## Environment Configuration

### Required Variables
```env
# Strapi backend URL (local or production)
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337

# (Optional) Strapi API token for authenticated operations
# Only needed if your Strapi backend restricts public writes
NEXT_PUBLIC_STRAPI_API_TOKEN=your_strapi_api_token_here

# (Optional, server-only) For secure server-side API calls
# Use this in production to keep the token secret
STRAPI_API_TOKEN=your_strapi_api_token_here
```

### Local Development
1. Copy `.env.example` to `.env.local`
2. Set `NEXT_PUBLIC_STRAPI_URL=http://localhost:1337` (or your local Strapi instance)
3. Run `npm run dev` — comments work with default public write permissions

### Production Deployment
1. Create a **Strapi API token** with `create` permission for comments:
   - Go to Strapi Admin → Settings → API Tokens → Create new token
   - Grant "Comments" collection → `create` action
   - Copy the token
2. Set environment variables:
   - `NEXT_PUBLIC_STRAPI_URL=https://your-strapi-domain.com`
   - `STRAPI_API_TOKEN=<your_token_here>` (or `NEXT_PUBLIC_STRAPI_API_TOKEN` if needed on client)
3. Deploy to Vercel/your hosting platform

## Comments System

### How It Works
1. User submits comment on article detail page
2. `src/services/commentService.js::createComment()` sends POST to Strapi
3. Strapi validates and creates comment record linked to article
4. UI updates to show new comment

### Troubleshooting

**Error: "403 Forbidden" when posting comments**
- **Cause:** Strapi Public role lacks `create` permission for comments
- **Fix:** 
  - Option A: In Strapi admin, grant Public role create permission for comments
  - Option B: Set a Strapi API token with create permission and configure it in `.env`

**Error: "Validation Error - relation does not exist"**
- **Cause:** Posted article ID doesn't exist in Strapi, or ID format is wrong
- **Fix:** Ensure article `id` (numeric) or `documentId` (string) is valid and exists in backend

**Comments not appearing after posting**
- **Check:** Browser console for fetch errors
- **Check:** Strapi logs for validation/permission errors
- **Check:** Strapi admin → Comments section to see if comment was created

## API Routes

### `/api/comments` (POST)
Server-side endpoint for comment creation. Falls back to client-side Strapi call if unavailable.

**Payload:**
```json
{
  "content": "User comment text",
  "authorName": "User name",
  "article": 6,
  "authorEmail": "user@example.com"  // optional
}
```

**Response:**
```json
{
  "data": {
    "id": 1,
    "documentId": "xyz123",
    "content": "User comment text",
    "authorName": "User name",
    "createdAt": "2026-02-16T23:25:00Z"
  }
}
```

## Development

### Running Locally
```bash
# Start Strapi (in strapi_cms folder)
cd strapi_cms && npm run develop

# Start Next.js (in nextjs folder)
cd nextjs && npm run dev
```

### Building for Production
```bash
npm run build
npm start
```

## Key Files
- `src/services/commentService.js` — Comment API functions
- `src/components/article/Comments.js` — Comments UI component
- `src/lib/strapi.js` — Strapi client helper
- `.env.example` — Environment template

## Support
For issues or questions, check the main project documentation or Strapi/Next.js official docs.
