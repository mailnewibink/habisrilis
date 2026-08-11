const fs = require('fs');

let createCode = fs.readFileSync('src/pages/app/CreateRelease.tsx', 'utf-8');
createCode = createCode.replace(/uploadArtwork\(artist\.userId, releaseRef\.id\)/g, 'uploadArtwork(artist.id, releaseRef.id)');
fs.writeFileSync('src/pages/app/CreateRelease.tsx', createCode);

let editCode = fs.readFileSync('src/pages/app/EditRelease.tsx', 'utf-8');
editCode = editCode.replace(/uploadArtwork\(artist\.userId, originalRelease\.id\)/g, 'uploadArtwork(artist.id, originalRelease.id)');
editCode = editCode.replace(/deleteArtwork\(artist\.userId, originalRelease\.id\)/g, 'deleteArtwork(artist.id, originalRelease.id)');
fs.writeFileSync('src/pages/app/EditRelease.tsx', editCode);

let myReleasesCode = fs.readFileSync('src/pages/app/MyReleases.tsx', 'utf-8');
myReleasesCode = myReleasesCode.replace(/deleteArtwork\(user\.id, releaseToDelete\)/g, 'deleteArtwork(user.id, releaseToDelete)'); // wait, user.id is correct since user.id is the UID
fs.writeFileSync('src/pages/app/MyReleases.tsx', myReleasesCode);

