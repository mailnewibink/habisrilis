const fs = require('fs');
let code = fs.readFileSync('src/pages/app/MyReleases.tsx', 'utf-8');

// Revert previous debug changes
code = code.replace(
  /const handleDelete = async \(e: React.MouseEvent, releaseId: string\) => \{([\s\S]*?)\};/,
  `const [releaseToDelete, setReleaseToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const requestDelete = (e: React.MouseEvent, releaseId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setReleaseToDelete(releaseId);
  };

  const confirmDelete = async () => {
    if (!releaseToDelete) return;
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, 'releases', releaseToDelete));
      setReleaseToDelete(null);
    } catch (err: any) {
      console.error('Error deleting release:', err);
      alert('Failed to delete release. See console for details.');
    } finally {
      setIsDeleting(false);
    }
  };`
);

// Add ConfirmModal import
if (!code.includes('ConfirmModal')) {
  code = code.replace(
    "import { EmptyState } from '../../components/ui/EmptyState';",
    "import { EmptyState } from '../../components/ui/EmptyState';\nimport { ConfirmModal } from '../../components/ui/ConfirmModal';"
  );
}

// Update the Trash button onClick
code = code.replace(
  /onClick=\{\(e\) => handleDelete\(e, release\.id\)\}/g,
  "onClick={(e) => requestDelete(e, release.id)}"
);

// Add the modal at the end of the return statement
code = code.replace(
  /<\/div>\s*\)\s*;\s*\}\s*;\s*$/,
  `      <ConfirmModal 
        isOpen={!!releaseToDelete} 
        title="Delete Release Page?" 
        message="This release will be permanently deleted." 
        onConfirm={confirmDelete} 
        onCancel={() => setReleaseToDelete(null)} 
        isConfirming={isDeleting} 
      />
    </div>
  );
};`
);

fs.writeFileSync('src/pages/app/MyReleases.tsx', code);
