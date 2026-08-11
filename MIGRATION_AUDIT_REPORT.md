# HabisRilis V1 - Firebase to Supabase Migration Audit

## A. Firebase Files
The following files currently import and use Firebase SDKs (`firebase/app`, `firebase/auth`, `firebase/firestore`, `firebase/storage`):
- `src/lib/firebase.ts`
- `src/lib/storage-utils.ts`
- `src/auth/AuthContext.tsx`
- `src/pages/public/ArtistProfile.tsx`
- `src/pages/public/ReleasePage.tsx`
- `src/pages/app/CreateRelease.tsx`
- `src/pages/app/Account.tsx`
- `src/pages/app/EditRelease.tsx`
- `src/pages/app/ArtistSetup.tsx`
- `src/pages/app/MyReleases.tsx`

## B. Firebase Auth Architecture
- **Context**: `AuthContext.tsx` manages `user` and `artist` state.
- **Provider**: Google Authentication via `signInWithPopup`.
- **Persistence**: Managed automatically by `onAuthStateChanged`.
- **Logout**: Handled via `signOut`.
- **Syncing**: Upon login, a user record is upserted into the Firestore `users` collection, and their associated `artists` document is fetched.
- **Supabase Changes Needed**:
  - Replace `onAuthStateChanged` with `supabase.auth.onAuthStateChange`.
  - Replace `signInWithPopup` with `supabase.auth.signInWithOAuth({ provider: 'google' })`.
  - Eliminate the manual syncing to a `users` collection, as Supabase natively handles this in the `auth.users` schema.

## C. Firestore Collections
Based on the current implementation, the database uses four collections:
1. `users`: Stores basic user profile data.
2. `artists`: Stores the public artist profile (bio, social links, username).
3. `usernames`: A reverse-lookup collection to reserve unique usernames.
4. `releases`: Stores music releases (singles/EPs/albums) linked to artists.

## D. Current Field Structures
Based on `src/types/index.ts`:

**User**
- `id` (string)
- `email` (string)
- `name` (string)
- `avatarUrl` (string, optional)
- `createdAt` (string)

**Artist**
- `id` (string)
- `userId` (string)
- `username` (string)
- `displayName` (string)
- `avatarUrl` (string, optional)
- `bio` (string, optional)
- `socialLinks` (Array of { platform, url, sortOrder }, optional)
- `createdAt` (string, optional)
- `updatedAt` (string, optional)

**Release**
- `id` (string)
- `artistId` (string)
- `title` (string)
- `slug` (string)
- `releaseType` ('single' | 'ep' | 'album')
- `releaseDate` (string)
- `artworkUrl` (string, optional)
- `artworkFormat` (string, optional)
- `spotifyUrl` (string, optional)
- `about` (string, optional)
- `aboutVisible` (boolean)
- `status` ('draft' | 'live' | 'archived')
- `streamingLinks` (Array of { platform, url, sortOrder }, optional)
- `createdAt` (string)
- `updatedAt` (string)

## E. Ownership Relationships
- **Current State**: `artistId` is exactly the same as `userId` (Firebase Auth UID). The `artists` document uses the UID as its document ID.
- **Redundancies**: `artists.userId` is technically redundant since the document ID is the UID itself. The `usernames` collection is merely a workaround for Firestore's lack of unique constraints.
- **Supabase Normalization**:
  - `artists` table can use `id` (UUID) as the primary key, mapping directly to `auth.users.id` via a foreign key.
  - The `usernames` collection can be completely eliminated by adding a `UNIQUE` constraint to the `username` column in the `artists` table.
  - `releases.artist_id` will be a foreign key referencing `artists.id`.

## F. Artwork Implementation
- **Current Component**: `ImageUpload.tsx` handles client-side canvas processing/compression and temporarily stores blobs in IndexedDB.
- **Storage Logic**: `storage-utils.ts` handles uploading to Firebase Storage via `uploadBytes` and `getDownloadURL`.
- **Storage Path**: `artworks/{artistId}/{releaseId}/artwork.{ext}`.
- **CRUD Hooks**: `CreateRelease.tsx`, `EditRelease.tsx`, and `Account.tsx` trigger explicit upload and deletion commands (`deleteArtwork`).
- **Supabase Changes Needed**:
  - Swap `firebase/storage` methods with `supabase.storage.from('artwork')`.
  - Use `.upload()` for insertion and `.remove()` for deletion.

## G. CRUD Implementation
**Artist:**
- **Create**: `ArtistSetup.tsx` (uses `writeBatch` to create artist and username docs).
- **Read**: `AuthContext.tsx` (current user), `ArtistProfile.tsx` (public read), `ReleasePage.tsx` (public read).
- **Update**: `Account.tsx` (updates profile, manages username changes via batch).
- **Delete**: `Account.tsx` (deletes user, artist, username, and all related releases).

**Release:**
- **Create**: `CreateRelease.tsx` (uses `setDoc`).
- **Read**: `ArtistProfile.tsx`, `ReleasePage.tsx`, `MyReleases.tsx`, `EditRelease.tsx`.
- **Update**: `EditRelease.tsx` (uses `updateDoc`).
- **Delete**: `MyReleases.tsx`, `EditRelease.tsx`, `Account.tsx`.

## H. Existing Security Rules
**Firestore Rules (`firestore.rules`):**
- **users**: Owner can CRUD.
- **artists**: Anyone can read. Owner can create, update, delete.
- **usernames**: Anyone can read. Owner can create, delete.
- **releases**: Anyone can read if `status == 'live'`. Owner can CRUD.

**Storage Rules (`storage.rules`):**
- **artworks**: Anyone can read. Owner (`request.auth.uid == userId`) can write.

**Supabase Translation**: These will translate cleanly into Row Level Security (RLS) policies in PostgreSQL.

## I. Proposed Supabase Schema
```sql
-- Artists table (1:1 with auth.users)
CREATE TABLE artists (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  social_links JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Releases table
CREATE TABLE releases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_id UUID NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  release_type TEXT NOT NULL,
  release_date TIMESTAMPTZ NOT NULL,
  artwork_url TEXT,
  artwork_format TEXT,
  spotify_url TEXT,
  about TEXT,
  about_visible BOOLEAN DEFAULT TRUE,
  status TEXT NOT NULL CHECK (status IN ('draft', 'live', 'archived')),
  streaming_links JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```
*(No separate `users` or `usernames` tables are needed, simplifying the architecture).*

## J. Proposed RLS Policies
**Artists Table:**
- `SELECT`: `true` (public)
- `INSERT/UPDATE/DELETE`: `auth.uid() = id`

**Releases Table:**
- `SELECT`: `status = 'live' OR auth.uid() = artist_id`
- `INSERT/UPDATE/DELETE`: `auth.uid() = artist_id`

**Artwork Storage Bucket:**
- `SELECT`: `true` (public)
- `INSERT/UPDATE/DELETE`: `auth.uid()::text = (storage.foldername(name))[2]` (assuming path `artworks/{uid}/{release_id}/...`)

## K. Files That Will Need Modification
1. **Infrastructure**:
   - `.env` (Swap Firebase keys for Supabase keys)
   - `src/lib/firebase.ts` -> replace with `src/lib/supabase.ts`
   - `src/lib/storage-utils.ts`
2. **Context**:
   - `src/auth/AuthContext.tsx`
3. **Pages/Components**:
   - `src/pages/public/ArtistProfile.tsx`
   - `src/pages/public/ReleasePage.tsx`
   - `src/pages/app/CreateRelease.tsx`
   - `src/pages/app/Account.tsx`
   - `src/pages/app/EditRelease.tsx`
   - `src/pages/app/ArtistSetup.tsx`
   - `src/pages/app/MyReleases.tsx`
4. **Types**:
   - `src/types/index.ts` (Minor tweaks for UUIDs and JSONB handling, remove redundancy).

## L. Files That Should Remain Untouched
All UI components, layout structures, and pure utility functions that do not interface with data fetching. Examples:
- `src/components/layout/*`
- `src/components/ui/*`
- `src/components/release/*` (Except where it directly imports from storage utils, but the UI itself is fine)
- `src/lib/image-utils.ts`
- `src/lib/share-utils.ts`
- Routing definitions in `App.tsx` / `main.tsx`

## M. Migration Risks
- **Data Migration**: Since the focus right now is on codebase migration, if actual user data exists in production Firestore, a separate ETL script will be needed to port `users`/`artists`/`releases` into Postgres and Firebase Storage items into Supabase Storage.
- **RLS Pathing for Storage**: Validating the correct RLS policy for the Supabase Storage bucket based on folder paths (`artworks/UID/RELEASE_ID`) can be tricky and needs careful testing.
- **Social/Streaming Links**: Supabase will return these as JSON arrays. We must ensure the frontend types correctly parse the JSONB columns from Postgres.
