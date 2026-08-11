require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// This script demonstrates the server-side approval mechanism.
// In a real production environment, this would run on a secure backend server (like Node.js Express or Edge Function).
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // MUST be service_role, not anon key

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing SUPABASE_SERVICE_ROLE_KEY or VITE_SUPABASE_URL in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function approveClaim(claimId) {
  const { data, error } = await supabase.rpc('approve_claim', { claim_id: claimId });
  if (error) {
    console.error("Error approving claim:", error.message);
  } else {
    console.log("Claim successfully approved!");
  }
}

async function rejectClaim(claimId) {
  const { data, error } = await supabase.rpc('reject_claim', { claim_id: claimId });
  if (error) {
    console.error("Error rejecting claim:", error.message);
  } else {
    console.log("Claim successfully rejected!");
  }
}

const action = process.argv[2];
const claimId = process.argv[3];

if (!action || !claimId) {
  console.log("Usage: node admin-claims.js [approve|reject] <claim_uuid>");
  process.exit(1);
}

if (action === 'approve') {
  approveClaim(claimId);
} else if (action === 'reject') {
  rejectClaim(claimId);
} else {
  console.log("Unknown action:", action);
}
