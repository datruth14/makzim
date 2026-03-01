# Turso DB Setup Guide (From Vercel)

## What is Turso DB?
Turso is a SQLite-compatible database service that works seamlessly with Vercel. It combines the simplicity of SQLite with the reliability of a managed database. Your data persists forever and works perfectly with serverless functions.

## Prerequisites
- Vercel account (https://vercel.com)
- Your project deployed to Vercel
- Turso account (free tier available) - https://turso.tech

## Setup Instructions

### Step 1: Create a Turso Account & Database

1. **Sign up for Turso:**
   - Go to https://turso.tech
   - Sign up with GitHub or email
   - Verify your account

2. **Create a Database:**
   - From the dashboard, click **Create a database**
   - Give it a name: `mazim-db`
   - Choose a region closest to you
   - Click **Create**

3. **Get Your Credentials:**
   - Your database URL will look like: `libsql://mazim-db-*.turso.io`
   - Click on your database
   - Go to **Auth tokens** tab
   - Create a new token (or use the default one)
   - Copy your:
     - **Database URL**
     - **Auth Token**

### Step 2: Add Environment Variables to Vercel

1. **Go to Vercel Dashboard:**
   - Select your project (`makzim`)
   - Go to **Settings** > **Environment Variables**

2. **Add Turso Variables:**
   ```
   TURSO_CONNECTION_URL=libsql://mazim-db-*.turso.io
   TURSO_AUTH_TOKEN=your-auth-token-here
   ```

3. **Add to Local `.env.local`:**
   ```
   TURSO_CONNECTION_URL=libsql://mazim-db-*.turso.io
   TURSO_AUTH_TOKEN=your-auth-token-here
   ```

### Step 3: Install Dependencies

```bash
npm install @libsql/client dotenv
```

This installs:
- `@libsql/client` - Official Turso/SQLite client
- `dotenv` - For loading environment variables

### Step 4: Update Your Code

Your project now uses Turso for both local development and production. The storage layer has been updated to use `app/lib/turso.ts`.

## How It Works

- **Local Development**: Connects directly to your Turso database
- **Production (Vercel)**: Uses KV environment variables for connection
- **Admin Dashboard** (`/admin/dashboard`): Saves content to Turso
- **Homepage**: Fetches content from Turso on page load
- **Profile images**, text, titles, all stored in SQLite/Turso

## Managing Your Database

### Using Turso CLI

1. **Install Turso CLI:**
   ```bash
   brew install tursodatabase/tap/turso  # macOS
   # or
   curl -sSfL https://install.turso.tech | bash  # Linux/macOS
   ```

2. **Login:**
   ```bash
   turso auth login
   ```

3. **View Your Databases:**
   ```bash
   turso db list
   ```

4. **Open Database Shell:**
   ```bash
   turso db shell mazim-db
   ```

5. **Execute SQL Queries:**
   ```sql
   SELECT * FROM admin_content;
   UPDATE admin_content SET heroTitle = 'New Title' WHERE id = 1;
   ```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Cannot find TURSO_CONNECTION_URL" | Add env vars to `.env.local` and Vercel Settings |
| Connection timeout | Check your IP whitelist in Turso dashboard (if applicable) |
| "Invalid auth token" | Regenerate your auth token in Turso dashboard |
| SSL errors | Update `@libsql/client` to latest version |

## Switching Between Databases

To switch back to Vercel KV:
1. Comment out Turso env variables
2. Use `kv-storage.ts` instead in your code

To use local SQLite (development only):
1. Use `sqlite.ts` instead
2. No environment variables needed

## Next Steps

- Test locally: `npm run dev`
- Push changes to GitHub
- Vercel will auto-deploy with Turso support
- Monitor database usage at https://app.turso.tech
