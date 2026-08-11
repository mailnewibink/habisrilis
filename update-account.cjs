const fs = require('fs');
let code = fs.readFileSync('src/pages/app/Account.tsx', 'utf-8');

code = code.replace(
  `import { doc, getDoc, updateDoc, writeBatch } from 'firebase/firestore';`,
  `import { doc, getDoc, updateDoc, writeBatch, collection, query, where, getDocs, deleteDoc } from 'firebase/firestore';`
);

code = code.replace(
  `import { LogOut, Loader2 } from 'lucide-react';`,
  `import { LogOut, Loader2, Trash2 } from 'lucide-react';`
);

const handleDeleteSnippet = `
  const handleDeleteAccount = async () => {
    if (!artist || !user) return;
    
    const confirmed = window.confirm(
      'WARNING: This is permanent.\\n\\nAre you sure you want to delete your artist profile and ALL your releases? This action cannot be undone.'
    );
    
    if (!confirmed) return;
    
    try {
      // 1. Get all releases for this artist
      const releasesQuery = query(collection(db, 'releases'), where('artistId', '==', artist.id));
      const releasesSnap = await getDocs(releasesQuery);
      
      const batch = writeBatch(db);
      
      // 2. Delete all releases
      releasesSnap.forEach((releaseDoc) => {
        batch.delete(doc(db, 'releases', releaseDoc.id));
      });
      
      // 3. Delete username mapping
      batch.delete(doc(db, 'usernames', artist.username));
      
      // 4. Delete artist profile
      batch.delete(doc(db, 'artists', artist.id));
      
      // 5. Delete user document
      batch.delete(doc(db, 'users', user.id));
      
      await batch.commit();
      
      await logout();
      navigate('/');
    } catch (err) {
      console.error('Error deleting account:', err);
      setError('Failed to delete account. Please try again.');
    }
  };

  const handleLogout = async () => {
`;

code = code.replace(`  const handleLogout = async () => {`, handleDeleteSnippet);

const logoutButtonTarget = `
        <Button onClick={handleLogout} variant="outline" fullWidth className="gap-2 !border-red-200 !text-red-500 hover:!bg-red-500 hover:!text-white">
          <LogOut className="h-4 w-4" />
          Log Out
        </Button>
      </div>`;

const deleteButtonSnippet = `
        <Button onClick={handleLogout} variant="outline" fullWidth className="mb-4 gap-2">
          <LogOut className="h-4 w-4" />
          Log Out
        </Button>

        <Button onClick={handleDeleteAccount} variant="outline" fullWidth className="gap-2 !border-red-200 !text-red-500 hover:!bg-red-500 hover:!text-white">
          <Trash2 className="h-4 w-4" />
          Delete Account
        </Button>
      </div>`;

code = code.replace(logoutButtonTarget, deleteButtonSnippet);

fs.writeFileSync('src/pages/app/Account.tsx', code);
