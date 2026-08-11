const fs = require('fs');
let content = fs.readFileSync('src/pages/public/ClaimArtist.tsx', 'utf-8');

const oldForm = `<form onSubmit={handleSubmit} className="space-y-8">`;
const newForm = `
          {!canClaim ? (
            <div className="text-center py-6">
              <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2">{accountType === 'manager' ? 'Free plan limit reached' : 'Cannot claim artist'}</h3>
              <p className="text-gray-500 text-sm mb-6">{limitMessage}</p>
              {accountType === 'manager' && plan === 'free' && (
                <Link to="/app/upgrade" className="block w-full mb-2">
                  <Button fullWidth size="lg">Upgrade to Manager Pro</Button>
                </Link>
              )}
              <Link to="/app">
                <Button variant="ghost" fullWidth>Return to Dashboard</Button>
              </Link>
            </div>
          ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
`;

if (content.includes(oldForm) && !content.includes('!canClaim')) {
  content = content.replace(oldForm, newForm);
  content = content.replace("</form>\n            )}\n          </div>\n        )}\n      </div>\n    </div>\n  );\n};", "</form>\n          )}\n            )}\n          </div>\n        )}\n      </div>\n    </div>\n  );\n};");
  fs.writeFileSync('src/pages/public/ClaimArtist.tsx', content);
}
