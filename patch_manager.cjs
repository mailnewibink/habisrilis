const fs = require('fs');
let content = fs.readFileSync('src/pages/app/ManagerDashboard.tsx', 'utf-8');

const oldHeader = `
          <h2 className="text-sm font-bold tracking-widest uppercase text-gray-500">My Artists</h2>
            {user?.plan === 'manager_pro' ? (
              <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest">Pro &bull; Unlimited artists</p>
            ) : (
              <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest">{artists.length} of 2 artists</p>
            )}
`;

const newHeader = `
          <div>
            <h2 className="text-sm font-bold tracking-widest uppercase text-gray-500">My Artists</h2>
            {user?.plan === 'manager_pro' ? (
              <div>
                <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest">Pro &bull; Unlimited artists</p>
                <p className="text-[10px] font-bold text-purple-600 mt-1 uppercase tracking-widest flex items-center gap-1">🎁 Free until 31 Dec 2026</p>
              </div>
            ) : (
              <div>
                <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest">Free Plan &bull; {artists.length} of 2 artists</p>
              </div>
            )}
          </div>
`;

content = content.replace(oldHeader.trim(), newHeader.trim());

fs.writeFileSync('src/pages/app/ManagerDashboard.tsx', content);
