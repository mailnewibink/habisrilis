const fs = require('fs');
let code = fs.readFileSync('src/pages/app/MyReleases.tsx', 'utf-8');

const targetCard = `
              <div key={release.id} className="group flex flex-col border border-gray-200 bg-white p-4 rounded-[14px] shadow-sm transition-all hover:border-black hover:shadow-md hover:-translate-y-0.5">
                <Link to={\`/app/edit/\${release.slug}\`} className="block flex-grow mb-4">
                  <div className="mb-4 flex items-center justify-between">
                    <ReleaseStatus status={release.status} />
                    <button 
                      onClick={(e) => handleDelete(e, release.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1"
                      title="Delete Release"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="mb-4 w-full">
                    <ArtworkDisplay url={release.artworkUrl || ''} alt={release.title} />
                  </div>
                  <div>
                    <h3 className="truncate text-lg font-bold tracking-tight text-[#111111]">{release.title}</h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-1">{release.releaseType}</p>
                  </div>
                </Link>`;

const replaceCard = `
              <div key={release.id} className="group relative flex flex-col border border-gray-200 bg-white p-4 rounded-[14px] shadow-sm transition-all hover:border-black hover:shadow-md hover:-translate-y-0.5">
                <div className="absolute top-4 right-4 z-10">
                  <button 
                    onClick={(e) => handleDelete(e, release.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-1.5 bg-white rounded-md shadow-sm border border-gray-100 opacity-0 group-hover:opacity-100 flex items-center justify-center"
                    title="Delete Release"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <Link to={\`/app/edit/\${release.slug}\`} className="block flex-grow mb-4">
                  <div className="mb-4 flex items-center justify-between">
                    <ReleaseStatus status={release.status} />
                    <div className="w-7 h-7"></div>
                  </div>
                  <div className="mb-4 w-full">
                    <ArtworkDisplay url={release.artworkUrl || ''} alt={release.title} />
                  </div>
                  <div>
                    <h3 className="truncate text-lg font-bold tracking-tight text-[#111111]">{release.title}</h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-1">{release.releaseType}</p>
                  </div>
                </Link>`;

code = code.replace(targetCard.trim(), replaceCard.trim());

fs.writeFileSync('src/pages/app/MyReleases.tsx', code);
