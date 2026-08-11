# HabisRilis V1 - Supabase Migration Phase 1 Report

## Backend Foundation Configured
The Supabase backend foundation has been created according to the specifications. No existing Firebase code or UI has been modified or removed.

### Files Created/Modified
- **`src/lib/supabase.ts`**: Created as a clean Supabase client module using environment variables.
- **`.env.example`**: Updated to include `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
- **`package.json`**: Installed `@supabase/supabase-js`.
- **`supabase/migrations/001_initial_schema.sql`**: Created with the complete schema, RLS policies, and storage configuration.

### SQL Migration Created
The migration file (`supabase/migrations/001_initial_schema.sql`) contains the following setup:
- **Tables Created**:
  - `profiles`: Linked to `auth.users(id)`.
  - `artists`: Includes unique `username`, linked to `auth.users(id)` via `user_id`.
  - `releases`: Linked to `artists(id)` with cascading deletion. Includes exact fields audited in Phase 0.
- **Constraints/Indexes**:
  - `artists.username` is unique.
  - `releases` has a composite unique constraint on `(artist_id, slug)`.
- **RLS Policies Created**:
  - **Profiles**: Authenticated users can read/update their own profile.
  - **Artists**: Public read; authenticated owner can CRUD based on `user_id = auth.uid()`.
  - **Releases**: Public read for `status = 'live'`; owner CRUD based on `artists.user_id = auth.uid()`.
- **Storage Bucket Created**:
  - Created `artwork` bucket (publicly readable).
- **Storage Policies Created**:
  - Public read for `artwork` bucket.
  - Authenticated owner can Insert/Update/Delete only if the first segment of the file path (`{user_id}`) matches their `auth.uid()`.
- **Functions/Triggers**:
  - Added a trigger on `auth.users` to automatically create a corresponding `profiles` record upon sign up.

### Google OAuth Configuration Status
Supabase Google OAuth requires manual configuration in the Supabase Dashboard. 
- You will need to obtain your **Google Client ID** and **Google Client Secret** from the Google Cloud Console.
- In the Supabase Dashboard, navigate to **Authentication -> Providers**, enable **Google**, and paste your credentials.

### Manual Configuration Required in Supabase Dashboard
1. Execute the `001_initial_schema.sql` migration against your Supabase database using the SQL Editor or Supabase CLI.
2. Set up the Google Auth Provider as mentioned above.
3. Retrieve your **Project URL** and **anon public API key** from **Project Settings -> API** and add them to your environment variables (`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`).

**Note**: Firebase remains fully functional as the active backend while this foundation is established.
