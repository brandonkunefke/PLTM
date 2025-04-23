# Vercel Deployment Guide for Poker Tournament Manager

This guide will help you set up your Poker Tournament Manager application on Vercel with a proper database connection.

## Step 1: Update Database Connection

1. Replace the contents of `src/lib/db.ts` with the code from `src/lib/db-postgres.ts`
2. Install PostgreSQL client:
   ```
   npm install pg
   ```

## Step 2: Set Up Vercel Postgres

1. In your Vercel dashboard, go to your project
2. Click on "Storage" in the left sidebar
3. Click "Connect Database" and select "Postgres"
4. Follow the setup wizard to create a new Postgres database
5. Vercel will automatically add the necessary environment variables to your project

## Step 3: Run Database Migrations

1. In your Vercel dashboard, go to "Settings" → "Environment Variables"
2. Verify that `POSTGRES_URL` (or similar) environment variable exists
3. Use the Vercel CLI to run the migration:
   ```
   vercel env pull .env.local
   psql $(grep POSTGRES_URL .env.local | cut -d '=' -f2-) -f migrations/postgres-migration.sql
   ```
   
   Alternatively, you can copy the contents of `migrations/postgres-migration.sql` and run it directly in the Vercel Postgres console.

## Step 4: Redeploy Your Application

1. Commit your changes to your repository
2. Push to your connected Git repository or run:
   ```
   vercel --prod
   ```

## Troubleshooting

If you encounter issues:

1. Check Vercel logs for any database connection errors
2. Verify environment variables are correctly set
3. Ensure the database migration ran successfully
4. Try adding console logs to debug database connection issues

## Alternative: Use External Database

If you prefer to use another database service:

1. Create a database on your preferred provider (like Supabase, PlanetScale, or Railway)
2. In your Vercel project dashboard, go to "Settings" → "Environment Variables"
3. Add the following environment variables with your database connection details:
   - `DATABASE_URL`: Your database connection string
   - `DATABASE_TYPE`: "postgres" or "mysql" depending on your choice
4. Run the appropriate migration script for your database type

## Need Help?

If you need further assistance, please let me know what specific issues you're encountering.
