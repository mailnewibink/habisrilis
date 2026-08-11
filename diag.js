import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

async function run() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEYS;
  console.log("Apakah SUPABASE_SERVICE_ROLE_KEY tersedia:", !!serviceKey);
  
  // We can't easily mock a full session here to hit the API without logging in, 
  // but we already tested the query directly. Let's just output the findings.
}
run();
