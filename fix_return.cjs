const fs = require('fs');
let content = fs.readFileSync('src/pages/public/ClaimArtist.tsx', 'utf-8');

const returnStart = content.indexOf('return (');
const preReturn = content.substring(0, returnStart);

const newReturn = `return (
    <div className="min-h-screen bg-[#F9F9F9] flex flex-col items-center justify-center p-6 selection:bg-gray-200">
      <div className="w-full max-w-2xl">
        <Link to="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-black transition-colors mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        {existingClaim && existingClaim.status === 'pending' && (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center shadow-sm">
            <h1 className="text-2xl font-bold uppercase tracking-widest text-[#111111] mb-4">Claim Submitted</h1>
            <p className="text-gray-500 mb-8">We are reviewing your claim for {artist?.displayName}. You will be notified once the verification process is complete.</p>
            
            <Link to="/app">
              <Button className="w-full">Go to Dashboard</Button>
            </Link>
          </div>
        )}

        {existingClaim && existingClaim.status === 'rejected' && (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center shadow-sm">
            <h1 className="text-2xl font-bold uppercase tracking-widest text-red-600 mb-4">Claim Rejected</h1>
            <p className="text-gray-500 mb-8">Your verification claim was not approved. The verification code you submitted is no longer valid. If you believe this is a mistake, you can submit a new claim.</p>
            
            <Button onClick={() => setExistingClaim(null)} className="w-full mb-4">Submit New Claim</Button>
            <Link to={\`/@\${artist?.username}\`}>
              <Button variant="outline" className="w-full">Return to Profile</Button>
            </Link>
          </div>
        )}

        {!existingClaim && artist && (
          <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
            <div className="text-center mb-10">
              <h1 className="text-2xl font-bold uppercase tracking-widest text-[#111111] mb-4">Claim this Artist Profile</h1>
              <p className="text-sm text-gray-500">If you are the artist or an authorized representative, you can request ownership of this profile. Do NOT claim an artist you do not represent.</p>
            </div>
            
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100 mb-10">
              {artist.avatarUrl ? (
                <img src={artist.avatarUrl} alt={artist.displayName} className="w-12 h-12 rounded-full object-cover border border-gray-200" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-200 border border-gray-200 flex items-center justify-center">
                  <span className="text-sm font-bold text-gray-400">{artist.displayName.charAt(0)}</span>
                </div>
              )}
              <div>
                <h3 className="font-bold text-[#111111]">{artist.displayName}</h3>
                <p className="text-xs text-gray-500">@{artist.username}</p>
              </div>
            </div>
            
            {!user ? (
              <div className="text-center border-t border-gray-100 pt-8 mt-4">
                <p className="text-sm text-gray-500 mb-6">You must be signed in to submit a claim.</p>
                <Button onClick={handleLogin} className="w-full h-12">
                  Sign in to Claim
                </Button>
              </div>
            ) : !canClaim ? (
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
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-4">
                    I am claiming this profile as:
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setClaimRole('artist')}
                      className={\`py-3 px-4 rounded border text-sm font-medium transition-colors \${claimRole === 'artist' ? 'border-black bg-black text-white' : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'}\`}
                    >
                      Artist
                    </button>
                    <button
                      type="button"
                      onClick={() => setClaimRole('manager')}
                      className={\`py-3 px-4 rounded border text-sm font-medium transition-colors \${claimRole === 'manager' ? 'border-black bg-black text-white' : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'}\`}
                    >
                      Manager / Label
                    </button>
                  </div>
                </div>
                
                <div className="border-t border-gray-100 pt-8">
                  <h3 className="text-lg font-bold text-[#111111] mb-6">Verification Instructions</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">Step 1</p>
                      <p className="text-sm text-gray-600 mb-3">Copy your unique verification code.</p>
                      <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded px-4 py-3">
                        <code className="text-sm font-mono font-bold text-black">{verificationCode}</code>
                        <button type="button" onClick={copyCode} className="text-gray-400 hover:text-black transition-colors">
                          {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">Step 2</p>
                      <p className="text-sm text-gray-600">Place it somewhere publicly associated with the artist. Options include:</p>
                      <ul className="list-disc list-inside text-sm text-gray-500 mt-2 ml-1 space-y-1">
                        <li>Spotify Artist Profile</li>
                        <li>Instagram Bio</li>
                        <li>TikTok Bio</li>
                        <li>SoundCloud Description</li>
                      </ul>
                    </div>
                    
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">Step 3</p>
                      <p className="text-sm text-gray-600 mb-3">Provide a link to where you placed the code.</p>
                      <input
                        type="url"
                        value={socialLink}
                        onChange={(e) => setSocialLink(e.target.value)}
                        placeholder="https://instagram.com/exampleartist"
                        required
                        className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-shadow"
                      />
                    </div>
                  </div>
                </div>
                
                {error && (
                  <div className="p-4 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                    {error}
                  </div>
                )}
                
                <div className="pt-4 border-t border-gray-100">
                  <Button type="submit" disabled={submitting} className="w-full h-12">
                    {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Submit Claim'}
                  </Button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
`;

fs.writeFileSync('src/pages/public/ClaimArtist.tsx', preReturn + newReturn);
