const fs = require('fs');
let content = fs.readFileSync('src/pages/app/ArtistSetup.tsx', 'utf-8');

content = content.replace(
  "const { user, artists, refreshArtistProfile, setActiveArtistId } = useAuth();",
  "const { user, artists, refreshArtistProfile, setActiveArtistId, updateUserAccountType } = useAuth();"
);

const beforeCreate = `
    try {
      const cleanUsername = username.trim().toLowerCase();
`;
const afterCreate = `
    try {
      if (user.accountType === 'fan') {
        await updateUserAccountType('artist');
        // Wait a small moment to ensure the JWT reflects the change for RLS
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      const cleanUsername = username.trim().toLowerCase();
`;
content = content.replace(beforeCreate.trim(), afterCreate.trim());

fs.writeFileSync('src/pages/app/ArtistSetup.tsx', content);
