const fs = require('fs');
let code = fs.readFileSync('src/auth/ProtectedRoute.tsx', 'utf8');
code = code.replace(
  "return <Navigate to=\"/app/setup\" replace />;",
  "console.log('Redirecting to /app/setup because:', { effectiveAccountType, requireArtist, artist, userAccountType: user.accountType }); return <Navigate to=\"/app/setup\" replace />;"
);
fs.writeFileSync('src/auth/ProtectedRoute.tsx', code);
