const fs = require('fs');
let code = fs.readFileSync('firestore.rules', 'utf-8');

code = code.replace(
  `allow delete: if isSignedIn() && existing().artistId == request.auth.uid;`,
  `allow delete: if isSignedIn() && resource.data.artistId == request.auth.uid;`
);

fs.writeFileSync('firestore.rules', code);
