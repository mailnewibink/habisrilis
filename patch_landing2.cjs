const fs = require('fs');

let code = fs.readFileSync('src/pages/public/LandingPage.tsx', 'utf-8');

const targetUi = `{featuredRelease ? (
                      <ReleaseCard
                        title={featuredRelease.title}
                        artistName={featuredRelease.artist?.displayName || 'Unknown'}
                        artworkUrl={featuredRelease.artworkUrl || ''}
                        slug={featuredRelease.slug}
                        artistUsername={featuredRelease.artist?.username}
                        releaseType={featuredRelease.releaseType}
                        releaseDate={featuredRelease.releaseDate}
                        hideListenButton
                      />
                    ) : (
                      <ReleaseCard
                        title="Hujan di Bulan Juli"
                        artistName="Ibink"
                        artworkUrl="https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=800&h=800"
                        hideListenButton
                      />
                    )}`;

const replaceUi = `{featuredRelease ? (
                      <ReleaseCard
                        title={featuredRelease.title}
                        artistName={featuredRelease.artist?.displayName || 'Unknown'}
                        artworkUrl={featuredRelease.artworkUrl || ''}
                        slug={featuredRelease.slug}
                        artistUsername={featuredRelease.artist?.username}
                        releaseType={featuredRelease.releaseType}
                        releaseDate={featuredRelease.releaseDate}
                        hideListenButton
                      />
                    ) : trendingReleases.length > 0 ? (
                      <ReleaseCard
                        title={trendingReleases[0].title}
                        artistName={trendingReleases[0].artist?.displayName || 'Unknown'}
                        artworkUrl={trendingReleases[0].artworkUrl || ''}
                        slug={trendingReleases[0].slug}
                        artistUsername={trendingReleases[0].artist?.username}
                        releaseType={trendingReleases[0].releaseType}
                        releaseDate={trendingReleases[0].releaseDate}
                        hideListenButton
                      />
                    ) : (
                      <div className="w-full aspect-square bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400">
                        No featured release
                      </div>
                    )}`;

code = code.replace(targetUi, replaceUi);

// Also make sure to check if lowercase replacement worked successfully earlier.
code = code.replace(
  /<span className="font-bold text-lg tracking-tighter lowercase hidden sm:block">habisrilis<span className="text-gray-600">.web.id<\/span><\/span>/g,
  '<span className="font-bold text-lg tracking-tighter hidden sm:block">habisrilis<span className="text-gray-500">.web.id</span></span>'
);

fs.writeFileSync('src/pages/public/LandingPage.tsx', code);
