const fs = require('fs');
let content = fs.readFileSync('src/lib/supabase/auth.ts', 'utf-8');

const oldCode = `export const updateAccountType = async (accountType: 'artist' | 'manager' | 'fan') => {
  const { error } = await supabase.auth.updateUser({
    data: { account_type: accountType }
  });`;

const newCode = `export const updateAccountType = async (accountType: 'artist' | 'manager' | 'fan', plan: 'free' | 'manager_pro' = 'free') => {
  const { error } = await supabase.auth.updateUser({
    data: { account_type: accountType, plan }
  });`;

if (content.includes("export const updateAccountType = async (accountType: 'artist' | 'manager' | 'fan') => {")) {
  content = content.replace(oldCode, newCode);
  fs.writeFileSync('src/lib/supabase/auth.ts', content);
}
