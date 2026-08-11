const fs = require('fs');

let content = fs.readFileSync('src/pages/app/SuperAdmin.tsx', 'utf-8');

// Add error state
content = content.replace(
  `const [isSuperAdmin, setIsSuperAdmin] = useState(false);`,
  `const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);`
);

// Update fetchReleases
content = content.replace(
  `const res = await fetch('/api/admin/releases', {
        headers: { 'Authorization': \`Bearer \${session.access_token}\` }
      });
      const data = await res.json();
      if (data.releases) setReleases(data.releases);`,
  `const res = await fetch('/api/admin/releases', {
        headers: { 'Authorization': \`Bearer \${session.access_token}\` }
      });
      const data = await res.json();
      if (!res.ok && data.error) {
        setErrorMsg(data.error);
      }
      if (data.releases) setReleases(data.releases);`
);

// Update fetchUsers
content = content.replace(
  `const res = await fetch('/api/admin/users', {
        headers: { 'Authorization': \`Bearer \${session.access_token}\` }
      });
      const data = await res.json();
      if (data.users) setUsers(data.users);`,
  `const res = await fetch('/api/admin/users', {
        headers: { 'Authorization': \`Bearer \${session.access_token}\` }
      });
      const data = await res.json();
      if (!res.ok && data.error) {
        setErrorMsg(data.error);
      }
      if (data.users) setUsers(data.users);`
);

// Add error message display
content = content.replace(
  `return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">`,
  `return (
    <div className="p-6">
      {errorMsg && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 border border-red-100">
          <h3 className="font-bold flex items-center gap-2"><UserX className="w-5 h-5"/> Backend Configuration Error</h3>
          <p className="mt-1">{errorMsg}</p>
          <p className="mt-2 text-sm">To fix this, you must add <strong>SUPABASE_SERVICE_ROLE_KEY</strong> to your server's environment variables (e.g., in Netlify settings or AI Studio <code>.env</code> file).</p>
        </div>
      )}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">`
);

fs.writeFileSync('src/pages/app/SuperAdmin.tsx', content);
console.log('Patched SuperAdmin.tsx');
