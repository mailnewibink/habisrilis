const fs = require('fs');
let content = fs.readFileSync('src/pages/public/ClaimArtist.tsx', 'utf-8');

const oldChunk = `            ) : (
                                    <div className="text-center py-6">`;

const newChunk = `            ) : !canClaim ? (
                                    <div className="text-center py-6">`;

content = content.replace(oldChunk, newChunk);
fs.writeFileSync('src/pages/public/ClaimArtist.tsx', content);
