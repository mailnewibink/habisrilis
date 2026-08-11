const fs = require('fs');
let content = fs.readFileSync('src/pages/app/ArtistSetup.tsx', 'utf-8');

const oldCode = `
            {accountType === 'manager' && plan === 'free' ? (
              <>
                <Button fullWidth size="lg" disabled>Upgrade to Pro — Rp149.000/bulan</Button>
                <Button variant="ghost" fullWidth onClick={() => navigate('/app/manager')}>Return to Dashboard</Button>
              </>
            ) : (
`;

const newCode = `
            {accountType === 'manager' && plan === 'free' ? (
              <>
                <Button fullWidth size="lg" onClick={() => navigate('/app/upgrade')}>Upgrade to Manager Pro</Button>
                <Button variant="ghost" fullWidth onClick={() => navigate('/app/manager')}>Return to Dashboard</Button>
              </>
            ) : (
`;

content = content.replace(oldCode.trim(), newCode.trim());
fs.writeFileSync('src/pages/app/ArtistSetup.tsx', content);
