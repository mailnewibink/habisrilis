const fs = require('fs');
let content = fs.readFileSync('src/pages/public/ClaimArtist.tsx', 'utf-8');

const oldCode = `
              {accountType === 'manager' && plan === 'free' && (
                <Button fullWidth size="lg" disabled className="mb-2">Upgrade to Pro — Rp149.000/bulan</Button>
              )}
`;

const newCode = `
              {accountType === 'manager' && plan === 'free' && (
                <Link to="/app/upgrade" className="block w-full mb-2">
                  <Button fullWidth size="lg">Upgrade to Manager Pro</Button>
                </Link>
              )}
`;

content = content.replace(oldCode.trim(), newCode.trim());
fs.writeFileSync('src/pages/public/ClaimArtist.tsx', content);
