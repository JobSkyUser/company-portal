# Fieldstone Portal - Setup Guide

## Overview

Internal portal for Fieldstone Homes employees. Provides a single hub for all company tools, apps, files, and resources with role-based access control (Employee, Manager, Admin) and Microsoft Entra ID SSO.

---

## Prerequisites

- Node.js 18+
- PostgreSQL database (local or hosted)
- Microsoft Entra ID (Azure AD) tenant

---

## 1. Install Dependencies

```bash
cd company-portal
npm install
```

## 2. Set Up the Database

### Option A: Local PostgreSQL
Install PostgreSQL locally and create a database:
```bash
createdb fieldstone_portal
```

### Option B: Railway PostgreSQL (Recommended for deployment)
1. Go to railway.app and create a new project
2. Add a PostgreSQL service
3. Copy the connection string from the Variables tab

Update your `.env` file with the connection string:
```
DATABASE_URL="postgresql://..."
```

Then run migrations:
```bash
npx prisma db push
npx prisma db seed
```

## 3. Configure Microsoft Entra ID (Azure AD)

### Register the Application
1. Go to [Azure Portal](https://portal.azure.com) > **Microsoft Entra ID** > **App registrations**
2. Click **New registration**
   - Name: `Fieldstone Portal`
   - Supported account types: **Single tenant** (this organization only)
   - Redirect URI: `http://localhost:3000/api/auth/callback/microsoft-entra-id`
3. Click **Register**

### Get Your Credentials
After registration, note these values:
- **Application (client) ID** → `AZURE_AD_CLIENT_ID`
- **Directory (tenant) ID** → `AZURE_AD_TENANT_ID`

### Create a Client Secret
1. Go to **Certificates & secrets** > **New client secret**
2. Add a description and expiration
3. Copy the secret **Value** (not the ID) → `AZURE_AD_CLIENT_SECRET`

### Configure API Permissions
1. Go to **API permissions**
2. Ensure these are present:
   - `openid` (delegated)
   - `profile` (delegated)
   - `email` (delegated)
   - `User.Read` (delegated)
3. Click **Grant admin consent**

### Update .env
```
AZURE_AD_CLIENT_ID="your-client-id"
AZURE_AD_CLIENT_SECRET="your-client-secret"
AZURE_AD_TENANT_ID="your-tenant-id"
```

### Generate Auth Secret
```bash
openssl rand -base64 32
```
Put this in `NEXTAUTH_SECRET`.

## 4. Run Locally

```bash
npm run dev
```

Visit http://localhost:3000. You'll see the login page.

## 5. First Login & Admin Setup

1. Sign in with your @fieldstonehomes.com Microsoft account
2. Your user record is created automatically with the EMPLOYEE role
3. Run the seed script to promote yourself to ADMIN:
   ```bash
   npx prisma db seed
   ```
   Or manually update via Prisma Studio:
   ```bash
   npx prisma studio
   ```
   Find your user and change `role` to `ADMIN`.

---

## Deployment (Railway)

### Deploy the App
1. Push code to a GitHub repo
2. In Railway, create a new service from the repo
3. Railway auto-detects Next.js and builds it

### Environment Variables
Set these in Railway's service variables:
- `DATABASE_URL` (auto-populated if using Railway PostgreSQL)
- `NEXTAUTH_URL` = `https://your-app.railway.app`
- `NEXTAUTH_SECRET` = (generate with `openssl rand -base64 32`)
- `AZURE_AD_CLIENT_ID`
- `AZURE_AD_CLIENT_SECRET`
- `AZURE_AD_TENANT_ID`

### Update Azure Redirect URI
Add your production URL to the Entra ID app registration:
```
https://your-app.railway.app/api/auth/callback/microsoft-entra-id
```

### Run Migrations in Production
Railway runs the build command automatically. Add a deploy command:
```bash
npx prisma db push && npm run build
```

---

## Restricting Access (Recommended)

### Option 1: Cloudflare Access (Recommended)
1. Add your Railway app's domain to Cloudflare
2. Set up a Cloudflare Access policy requiring Entra ID authentication
3. This adds a zero-trust layer — only authenticated Fieldstone users can even reach the site

### Option 2: Railway Private Networking
Use Railway's private networking to make the app only accessible from your office network or VPN.

### Option 3: IP Allowlist
Configure your Railway service to only accept traffic from your office IP range.

---

## Managing the Portal

### Adding Apps (Manager/Admin)
1. Go to **Manage Apps** in the sidebar
2. Click **Add App**
3. Fill in the name, URL, icon, category, and minimum role
4. The app appears on the dashboard for users with sufficient access

### Managing Users (Manager/Admin)
1. Go to **Manage Users** in the sidebar
2. Users appear after their first SSO login
3. Change roles using the dropdown (Employee, Manager, Admin)
4. Set departments for organizational grouping

### Access Tiers
- **Employee**: Can see basic apps and files
- **Manager**: Can see all apps/files + manage apps, users, and files
- **Admin**: Full access including portal settings

---

## Architecture

```
src/
├── app/
│   ├── (auth)/login/        # SSO login page
���   ├── (portal)/
│   │   ├── dashboard/       # Main app dashboard
│   │   ├── apps/[id]/       # Embedded app viewer
│   │   ├── files/           # File browser
│   │   └── admin/           # Manager-only admin panel
│   └── api/                 # REST API routes
├── components/              # Reusable UI components
├── lib/                     # Auth, DB, role utilities
└── middleware.ts             # Auth + RBAC route protection
```

## Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Auth**: NextAuth.js v5 + Microsoft Entra ID
- **Database**: PostgreSQL + Prisma ORM
- **Styling**: Tailwind CSS (Fieldstone brand tokens)
- **Icons**: Lucide React
