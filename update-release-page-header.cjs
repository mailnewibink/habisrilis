const fs = require('fs');
let code = fs.readFileSync('src/pages/public/ReleasePage.tsx', 'utf-8');

if (!code.includes("useAuth")) {
  code = code.replace(
    `import { getReleasePublicUrl, getReleaseShareText, setSocialMetadata } from '../../lib/share-utils';`,
    `import { getReleasePublicUrl, getReleaseShareText, setSocialMetadata } from '../../lib/share-utils';\nimport { useAuth } from '../../auth/AuthContext';`
  );
}

code = code.replace(
  `export const ReleasePage = () => {\n  const { username, releaseSlug } = useParams<{ username: string; releaseSlug: string }>();`,
  `export const ReleasePage = () => {\n  const { username, releaseSlug } = useParams<{ username: string; releaseSlug: string }>();\n  const { user } = useAuth();`
);

const targetHeader = `
      <header className="p-6 flex items-center justify-between border-b border-gray-100 mb-8 bg-white">
         <Link to={\`/@\${artist.username}\`} className="flex items-center gap-3 group">
           {artist.avatarUrl ? (
             <img src={artist.avatarUrl} alt={artist.displayName} className="w-8 h-8 rounded-full object-cover border border-gray-200 group-hover:border-black transition-colors" />
           ) : (
             <div className="w-8 h-8 rounded-full bg-gray-200 border border-gray-200 flex items-center justify-center group-hover:border-black transition-colors">
               <span className="text-[10px] font-bold text-gray-400">{artist.displayName.charAt(0)}</span>
             </div>
           )}
           <div className="flex flex-col">
             <span className="text-xs font-bold tracking-widest uppercase text-[#111111] group-hover:text-gray-600 transition-colors">{artist.displayName}</span>
             <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-gray-400">View Profile</span>
           </div>
         </Link>
      </header>
`;

const replaceHeader = `
      <header className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 mb-8 bg-white">
         <Link to={\`/@\${artist.username}\`} className="flex items-center gap-3 group shrink-0">
           {artist.avatarUrl ? (
             <img src={artist.avatarUrl} alt={artist.displayName} className="w-8 h-8 rounded-full object-cover border border-gray-200 group-hover:border-black transition-colors" />
           ) : (
             <div className="w-8 h-8 rounded-full bg-gray-200 border border-gray-200 flex items-center justify-center group-hover:border-black transition-colors">
               <span className="text-[10px] font-bold text-gray-400">{artist.displayName.charAt(0)}</span>
             </div>
           )}
           <div className="flex flex-col">
             <span className="text-xs font-bold tracking-widest uppercase text-[#111111] group-hover:text-gray-600 transition-colors">{artist.displayName}</span>
             <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-gray-400">View Profile</span>
           </div>
         </Link>

         {user && user.id === artist.userId && (
           <div className="flex items-center gap-4 shrink-0">
             <Link to="/app" className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors flex items-center gap-1">
               <ArrowLeft className="w-3 h-3" />
               My Releases
             </Link>
             <Link to={\`/app/edit/\${release.slug}\`} className="text-[10px] font-bold uppercase tracking-widest text-black border-b border-black pb-0.5 hover:text-gray-500 hover:border-gray-500 transition-colors">
               Edit Release
             </Link>
           </div>
         )}
      </header>
`;

code = code.replace(targetHeader.trim(), replaceHeader.trim());

fs.writeFileSync('src/pages/public/ReleasePage.tsx', code);
console.log("Updated ReleasePage.tsx");
