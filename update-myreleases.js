const fs = require('fs');
let code = fs.readFileSync('src/pages/app/MyReleases.tsx', 'utf-8');

code = code.replace(
  `import { collection, query, where, onSnapshot } from 'firebase/firestore';`,
  `import { collection, query, where, onSnapshot, doc, deleteDoc } from 'firebase/firestore';`
);

code = code.replace(
  `import { Loader2 } from 'lucide-react';`,
  `import { Loader2, Trash2 } from 'lucide-react';`
);

const handleDeleteSnippet = `
  const handleDelete = async (e: React.MouseEvent, releaseId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('Delete Release Page?\\n\\nThis release will be permanently deleted.')) {
      try {
        await deleteDoc(doc(db, 'releases', releaseId));
      } catch (err) {
        console.error('Error deleting release:', err);
        alert('Failed to delete release.');
      }
    }
  };

  useEffect(() => {
`;

code = code.replace(`  useEffect(() => {`, handleDeleteSnippet);

const targetStatusSnippet = `
                  <div className="mb-4 flex items-center justify-between">
                    <ReleaseStatus status={release.status} />
                  </div>
`;

const replaceStatusSnippet = `
                  <div className="mb-4 flex items-center justify-between">
                    <ReleaseStatus status={release.status} />
                    <button 
                      onClick={(e) => handleDelete(e, release.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1"
                      title="Delete Release"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
`;

code = code.replace(targetStatusSnippet, replaceStatusSnippet);

fs.writeFileSync('src/pages/app/MyReleases.tsx', code);
