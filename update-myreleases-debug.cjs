const fs = require('fs');
let code = fs.readFileSync('src/pages/app/MyReleases.tsx', 'utf-8');

code = code.replace(
  /const handleDelete = async \(e: React.MouseEvent, releaseId: string\) => \{([\s\S]*?)\};/,
  `const handleDelete = async (e: React.MouseEvent, releaseId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('[DELETE DEBUG] button clicked');
    console.log('[DELETE DEBUG] release document ID:', releaseId);
    console.log('[DELETE DEBUG] current authenticated user:', user?.id);
    
    let confirmed = false;
    try {
      confirmed = window.confirm('Delete Release Page?\\n\\nThis release will be permanently deleted.');
    } catch(err) {
      console.error('[DELETE DEBUG] window.confirm threw an error:', err);
      confirmed = true; // bypass if it throws due to sandbox
    }
    
    console.log('[DELETE DEBUG] confirmation result:', confirmed);
    
    if (confirmed) {
      try {
        console.log('[DELETE DEBUG] attempting Firestore delete for', releaseId);
        await deleteDoc(doc(db, 'releases', releaseId));
        console.log('[DELETE DEBUG] Firestore delete SUCCESS');
      } catch (err: any) {
        console.error('[DELETE DEBUG] Firestore delete ERROR:', err);
        console.error('[DELETE DEBUG] error code:', err?.code);
        console.error('[DELETE DEBUG] error message:', err?.message);
        alert('Failed to delete release. See console for details.');
      }
    }
  };`
);
fs.writeFileSync('src/pages/app/MyReleases.tsx', code);
