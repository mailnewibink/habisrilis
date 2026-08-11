const fs = require('fs');
let code = fs.readFileSync('src/pages/app/EditRelease.tsx', 'utf-8');

code = code.replace(
  /const handleDelete = async \(\) => \{([\s\S]*?)\};/,
  `const handleDelete = async () => {
    if (!artist || !originalRelease) return;
    
    console.log('[DELETE DEBUG] button clicked');
    console.log('[DELETE DEBUG] release object:', originalRelease);
    console.log('[DELETE DEBUG] release document ID:', originalRelease.id);
    console.log('[DELETE DEBUG] current authenticated user:', artist.userId);
    
    let confirmed = false;
    try {
      confirmed = window.confirm('Delete Release Page?\\n\\nThis release will be permanently deleted.');
    } catch(err) {
      console.error('[DELETE DEBUG] window.confirm threw an error:', err);
      confirmed = true;
    }
    console.log('[DELETE DEBUG] confirmation result:', confirmed);
    
    if (confirmed) {
      setIsDeleting(true);
      try {
        console.log('[DELETE DEBUG] attempting Firestore delete for', originalRelease.id);
        await deleteDoc(doc(db, 'releases', originalRelease.id));
        console.log('[DELETE DEBUG] Firestore delete SUCCESS');
        navigate('/app');
      } catch (err: any) {
        console.error('[DELETE DEBUG] Firestore delete ERROR:', err);
        console.error('[DELETE DEBUG] error code:', err?.code);
        console.error('[DELETE DEBUG] error message:', err?.message);
        setError(\`An error occurred while deleting: \${err?.message}\`);
        setIsDeleting(false);
      }
    }
  };`
);
fs.writeFileSync('src/pages/app/EditRelease.tsx', code);
