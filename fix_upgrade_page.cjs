const fs = require('fs');
let content = fs.readFileSync('src/pages/app/UpgradePage.tsx', 'utf-8');

content = content.replace(
  "const { user, updateUserAccountType } = useAuth();",
  "const { user, updateUserAccountType, refreshPlan } = useAuth();"
);

const oldCode = `        // Update local session state
        await updateUserAccountType('manager', 'manager_pro');
        
        // Wait a bit for auth token to refresh
        await new Promise(resolve => setTimeout(resolve, 500));
        navigate('/app/manager');`;

const newCode = `        // Refresh plan globally from db
        await refreshPlan();
        navigate('/app/manager');`;

content = content.replace(oldCode, newCode);
fs.writeFileSync('src/pages/app/UpgradePage.tsx', content);
