const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');
content = content.replace("import { AdminFeatured } from './pages/app/AdminFeatured';", "import { AdminFeatured } from './pages/app/AdminFeatured';\nimport { SuperAdmin } from './pages/app/SuperAdmin';");
content = content.replace(
  `<Route path="/app/admin/featured" element={
            <ProtectedRoute requireArtist={false}>
              <AdminFeatured />
            </ProtectedRoute>
          } />`,
  `<Route path="/app/admin/featured" element={
            <ProtectedRoute requireArtist={false}>
              <AdminFeatured />
            </ProtectedRoute>
          } />
          <Route path="/app/admin/super" element={
            <ProtectedRoute requireArtist={false}>
              <SuperAdmin />
            </ProtectedRoute>
          } />`
);
fs.writeFileSync('src/App.tsx', content);
