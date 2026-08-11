const fs = require('fs');
let content = fs.readFileSync('src/auth/ProtectedRoute.tsx', 'utf-8');

const oldFanLogic = `  if (effectiveAccountType === 'fan' && !location.pathname.startsWith('/app/fan')) {
    return <Navigate to="/app/fan" replace />;
  }`;

const newFanLogic = `  if (effectiveAccountType === 'fan' && !location.pathname.startsWith('/app/fan') && location.pathname !== '/app/setup') {
    return <Navigate to="/app/fan" replace />;
  }`;

content = content.replace(oldFanLogic, newFanLogic);

fs.writeFileSync('src/auth/ProtectedRoute.tsx', content);
