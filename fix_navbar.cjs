const fs = require('fs');

let path = 'src/components/layout/PublicNavbar.tsx';
let content = fs.readFileSync(path, 'utf8');

const target = `<Button variant="outline" size="sm" onClick={handleLogin} disabled={isLoggingIn}>
             {isLoggingIn ? <Loader2 className="w-4 h-4 animate-spin" /> : user ? (effectiveAccountType ? t('nav.dashboard') : t('nav.completeSetup')) : t('nav.signIn')}
           </Button>`;

const replacement = `{user ? (
             <Button variant="outline" size="sm" onClick={handleLogin} disabled={isLoggingIn}>
               {isLoggingIn ? <Loader2 className="w-4 h-4 animate-spin" /> : (effectiveAccountType ? t('nav.dashboard') : t('nav.completeSetup'))}
             </Button>
           ) : (
             <div className="flex items-center gap-2">
               <Button variant="ghost" size="sm" onClick={handleLogin} disabled={isLoggingIn}>
                 {t('nav.signIn')}
               </Button>
               <Button variant="outline" size="sm" onClick={handleLogin} disabled={isLoggingIn}>
                 {isLoggingIn ? <Loader2 className="w-4 h-4 animate-spin" /> : t('nav.signUp')}
               </Button>
             </div>
           )}`;

content = content.replace(target, replacement);
fs.writeFileSync(path, content);
