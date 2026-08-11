import { initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

const app = initializeApp();
async function run() {
  try {
    const config = await getAuth().projectConfigManager().getProjectConfig();
    console.log('Current domains:', config.authorizedDomains);
    const newDomains = [...new Set([...config.authorizedDomains, 'habisrilis.ai.studio'])];
    await getAuth().projectConfigManager().updateProjectConfig({ authorizedDomains: newDomains });
    console.log('Successfully updated domains!');
  } catch (e) {
    console.error(e);
  }
}
run();
