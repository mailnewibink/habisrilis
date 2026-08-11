const fs = require('fs');
let content = fs.readFileSync('src/components/layout/AppShell.tsx', 'utf-8');
content = content.replace(
  `<NavLink
                  to="/app/admin/featured"
                  className={({ isActive }) =>
                    cn('transition-opacity hover:opacity-50', isActive ? 'text-blue-600' : 'text-gray-400')
                  }
                >
                  Admin Featured
                </NavLink>`,
  `<NavLink
                  to="/app/admin/super"
                  className={({ isActive }) =>
                    cn('transition-opacity hover:opacity-50', isActive ? 'text-blue-600' : 'text-gray-400')
                  }
                >
                  Super Admin
                </NavLink>`
);
fs.writeFileSync('src/components/layout/AppShell.tsx', content);
