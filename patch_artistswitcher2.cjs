const fs = require('fs');
let content = fs.readFileSync('src/components/layout/ArtistSwitcher.tsx', 'utf-8');

const oldClaimArtist = `
            <button
              onClick={() => {
                setIsOpen(false);
                navigate('/app/claim-artist');
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-black hover:bg-gray-50 rounded-[10px] transition-colors"
            >
              <Search className="w-4 h-4" />
              Claim Artist
            </button>
`;

const newClaimArtist = `
            {user?.accountType !== 'artist' && (
            <button
              onClick={() => {
                setIsOpen(false);
                navigate('/app/claim-artist');
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-black hover:bg-gray-50 rounded-[10px] transition-colors"
            >
              <Search className="w-4 h-4" />
              Claim Artist
            </button>
            )}
`;

content = content.replace(oldClaimArtist.trim(), newClaimArtist.trim());

fs.writeFileSync('src/components/layout/ArtistSwitcher.tsx', content);
