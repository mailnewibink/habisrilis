const fs = require('fs');
let content = fs.readFileSync('src/auth/AuthContext.tsx', 'utf-8');

const oldContextType = `  updateUserAccountType: (accountType: 'artist' | 'manager' | 'fan') => Promise<void>;`;
const newContextType = `  updateUserAccountType: (accountType: 'artist' | 'manager' | 'fan', plan?: 'free' | 'manager_pro') => Promise<void>;`;

const oldHandle = `  const handleUpdateUserAccountType = async (accountType: 'artist' | 'manager' | 'fan') => {
    await updateAccountType(accountType);
    if (user) {
      setUser({ ...user, accountType });
    }
  };`;

const newHandle = `  const handleUpdateUserAccountType = async (accountType: 'artist' | 'manager' | 'fan', plan: 'free' | 'manager_pro' = 'free') => {
    await updateAccountType(accountType, plan);
    if (user) {
      setUser({ ...user, accountType, plan });
    }
  };`;

content = content.replace(oldContextType, newContextType);
content = content.replace(oldHandle, newHandle);

fs.writeFileSync('src/auth/AuthContext.tsx', content);
