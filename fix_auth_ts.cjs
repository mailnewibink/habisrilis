const fs = require('fs');
let content = fs.readFileSync('src/lib/supabase/auth.ts', 'utf-8');
content = content.replace(
  "export const updateAccountType = async (accountType: 'artist' | 'manager' | 'fan', plan: 'free' | 'manager_pro' = 'free') => {",
  "export const updateAccountType = async (accountType: 'artist' | 'manager' | 'fan') => {"
);
content = content.replace(
  "data: { account_type: accountType, plan }",
  "data: { account_type: accountType }"
);
// Stop setting plan from metadata
content = content.replace(
  "plan: session.user.user_metadata?.plan || 'free',",
  "plan: 'free', // Will be fetched from manager_subscriptions"
);
fs.writeFileSync('src/lib/supabase/auth.ts', content);
