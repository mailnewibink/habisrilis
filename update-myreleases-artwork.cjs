const fs = require('fs');
let code = fs.readFileSync('src/pages/app/MyReleases.tsx', 'utf-8');

if (!code.includes('deleteArtwork')) {
  code = code.replace(
    /import \{ getReleasePublicUrl, getReleaseShareText \} from '\.\.\/\.\.\/lib\/share-utils';/,
    "import { getReleasePublicUrl, getReleaseShareText } from '../../lib/share-utils';\nimport { deleteArtwork } from '../../lib/storage-utils';"
  );
  
  code = code.replace(
    /await deleteDoc\(doc\(db, 'releases', releaseToDelete\)\);/,
    "await deleteDoc(doc(db, 'releases', releaseToDelete));\n      if (user) await deleteArtwork(user.id, releaseToDelete);"
  );
  
  fs.writeFileSync('src/pages/app/MyReleases.tsx', code);
}
