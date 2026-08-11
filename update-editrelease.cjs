const fs = require('fs');
let code = fs.readFileSync('src/pages/app/EditRelease.tsx', 'utf-8');

// Revert previous debug changes
code = code.replace(
  /const handleDelete = async \(\) => \{([\s\S]*?)\};/,
  `const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const requestDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!artist || !originalRelease) return;
    
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, 'releases', originalRelease.id));
      navigate('/app');
    } catch (err: any) {
      console.error('Error deleting release:', err);
      setError(\`An error occurred while deleting: \${err?.message}\`);
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };`
);

// Add ConfirmModal import
if (!code.includes('ConfirmModal')) {
  code = code.replace(
    "import { Button } from '../../components/ui/Button';",
    "import { Button } from '../../components/ui/Button';\nimport { ConfirmModal } from '../../components/ui/ConfirmModal';"
  );
}

// Update the Trash button onClick
code = code.replace(
  /onClick=\{handleDelete\}/g,
  "onClick={requestDelete}"
);

// Add the modal at the end of the return statement
code = code.replace(
  /<\/div>\s*\)\s*;\s*\}\s*;\s*$/,
  `      <ConfirmModal 
        isOpen={showDeleteConfirm} 
        title="Delete Release Page?" 
        message="This release will be permanently deleted." 
        onConfirm={confirmDelete} 
        onCancel={() => setShowDeleteConfirm(false)} 
        isConfirming={isDeleting} 
      />
    </div>
  );
};`
);

fs.writeFileSync('src/pages/app/EditRelease.tsx', code);
