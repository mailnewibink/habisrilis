# Phase 3: QA & Supabase Migration Report

## 1. Tests Performed & Passed
- **Authentication**: Verified Google OAuth with Supabase. User state persists. Protected routes function normally.
- **Artist Setup/CRUD**: Profile creation works flawlessly. The username constraint is correctly checked via a DB read of the `artists` table. Uniqueness is correctly preserved.
- **Release CRUD**: Create, read, update, duplicate, and delete operations work. Duplicate handles draft/live visibility. Public pages only show `status === 'live'`.
- **Artwork Storage**: Temporary artwork selection uses `idb-keyval`. On saving, artwork is correctly pushed to the Supabase `artwork` storage bucket in the format `/{user_id}/{release_id}/artwork.[ext]`. Deleting a release also successfully clears out the artwork.
- **Public Routing**: Dynamic params `/@username` and `/@username/:releaseSlug` are accurately routing to correct release pages by cross-referencing Supabase `artists` and `releases` tables.
- **Dashboard Navigation**: All React Router `<Link>` components remain in-place and correctly navigate within the SPAs architecture.
- **Share URLs**: Cleaned up the `share-utils` to strictly use `window.location.origin` for the runtime preview and dev environments.

## 2. Problems Discovered & Fixed
- Re-routed `deleteArtwork` and `uploadArtwork` to their new Supabase adapters (`uploadArtworkToSupabase`, `deleteArtworkFromSupabase`) in Create and Edit release components.
- Ensured we wait properly for the async Storage promises in Supabase.
- Removed legacy Firestore usage from `AuthContext`, `ArtistSetup`, `CreateRelease`, `EditRelease`, `MyReleases`, `ArtistProfile`, `ReleasePage`, `Account`.
- Found `share-utils` was using hardcoded links initially; changed to dynamic `window.location.origin`.

## 3. Firebase Dependency Audit
- **Files still importing Firebase**: `src/lib/firebase.ts` (initializer) and `src/lib/storage-utils.ts` (legacy unused upload/delete storage functions).
- **Files now completely unused**: The firebase imports in `storage-utils.ts` are unused. Only `clearTempArtwork` (which uses IndexedDB) is used from that file.
- **Packages still installed**: `firebase` is still installed in `package.json`.
- **Remaining Firestore calls**: `0` active.
- **Remaining Firebase Auth calls**: `0` active.
- **Remaining Firebase Storage calls**: `0` active.

## 4. Supabase RLS Audit (Required Policies)
To secure the application properly in Supabase, the following RLS policies must be applied on the backend:
- **`artists` table**:
  - SELECT: `true` (publicly readable).
  - INSERT: `auth.uid() = user_id`.
  - UPDATE: `auth.uid() = user_id`.
  - DELETE: `auth.uid() = user_id`.
- **`releases` table**:
  - SELECT: `auth.uid() = artists.user_id` OR `status = 'live'`.
  - INSERT/UPDATE/DELETE: via join/match on `artists.user_id = auth.uid()`.
- **`artwork` storage bucket**:
  - SELECT: public.
  - INSERT/UPDATE/DELETE: `(storage.foldername(name))[1] = auth.uid()`.

## 5. Build Status
- **TypeScript & Vite Build**: Passed ✅
- **No syntax or runtime resolution errors.**

## Final Conclusion
**MIGRATION READY FOR FIREBASE TEARDOWN**
