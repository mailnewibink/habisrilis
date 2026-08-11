const fs = require('fs');

function replaceBranding(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Replace uppercase logo text with lowercase and gray .web.id
  content = content.replace(
    /<span className="font-bold text-lg tracking-tighter uppercase (.*?)">habisrilis.web.id<\/span>/g,
    '<span className="font-bold text-lg tracking-tighter lowercase $1">habisrilis<span className="text-gray-600">.web.id</span></span>'
  );
  
  content = content.replace(
    /<span className="font-bold text-lg tracking-tighter uppercase">habisrilis.web.id<\/span>/g,
    '<span className="font-bold text-lg tracking-tighter lowercase">habisrilis<span className="text-gray-600">.web.id</span></span>'
  );

  fs.writeFileSync(filePath, content);
}

replaceBranding('src/components/layout/AppShell.tsx');
replaceBranding('src/pages/public/LandingPage.tsx');

