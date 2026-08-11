const fs = require('fs');

let path = 'src/pages/public/LandingPage.tsx';
let content = fs.readFileSync(path, 'utf8');

const target = `<div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6">
                      <Button size="lg" fullWidth onClick={handleLogin} disabled={isLoggingIn}>
                        {isLoggingIn ? <Loader2 className="w-5 h-5 animate-spin" /> : user ? (effectiveAccountType ? t('landing.goToDashboard') : t('landing.completeSetup')) : t('landing.signInWithGoogle')}
                      </Button>
                      <Link to="/examples" className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest group">
                        {t('landing.seeExample')} <span className="group-hover:translate-x-1 transition-transform">→</span>
                      </Link>
                    </div>`;

const replacement = `<div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                      {user ? (
                        <Button size="lg" fullWidth onClick={handleLogin} disabled={isLoggingIn}>
                          {isLoggingIn ? <Loader2 className="w-5 h-5 animate-spin" /> : (effectiveAccountType ? t('landing.goToDashboard') : t('landing.completeSetup'))}
                        </Button>
                      ) : (
                        <>
                          <Button size="lg" fullWidth onClick={handleLogin} disabled={isLoggingIn}>
                            {isLoggingIn ? <Loader2 className="w-5 h-5 animate-spin" /> : t('landing.createPage')}
                          </Button>
                          <Button size="lg" variant="outline" fullWidth onClick={handleLogin} disabled={isLoggingIn}>
                            {isLoggingIn ? <Loader2 className="w-5 h-5 animate-spin" /> : t('landing.joinAsFan')}
                          </Button>
                        </>
                      )}
                      <Link to="/examples" className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest group whitespace-nowrap ml-2">
                        {t('landing.seeExample')} <span className="group-hover:translate-x-1 transition-transform">→</span>
                      </Link>
                    </div>`;

content = content.replace(target, replacement);
fs.writeFileSync(path, content);
