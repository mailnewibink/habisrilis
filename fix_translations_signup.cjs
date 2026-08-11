const fs = require('fs');

let path = 'src/lib/i18n/translations.ts';
let content = fs.readFileSync(path, 'utf8');

// ID translations
content = content.replace(
  "signIn: 'Masuk',",
  "signIn: 'Masuk',\n      signUp: 'Daftar',"
);
content = content.replace(
  "signInWithGoogle: 'Masuk dengan Google',",
  "signInWithGoogle: 'Masuk dengan Google',\n      createPage: 'Buat halamanmu',\n      joinAsFan: 'Gabung sebagai Fan',"
);

// EN translations
content = content.replace(
  "signIn: 'Sign In',",
  "signIn: 'Sign In',\n      signUp: 'Sign Up',"
);
content = content.replace(
  "signInWithGoogle: 'Sign in with Google',",
  "signInWithGoogle: 'Sign in with Google',\n      createPage: 'Create your page',\n      joinAsFan: 'Join as Fan',"
);

fs.writeFileSync(path, content);
