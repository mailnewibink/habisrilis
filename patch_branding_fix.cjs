const fs = require('fs');

function replaceBranding(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Replace the previously patched lowercase version with proper gray color and remove lowercase class
  content = content.replace(
    /<span className="font-bold text-lg tracking-tighter lowercase (.*?)">habisrilis<span className="text-gray-600">\.web\.id<\/span><\/span>/g,
    '<span className="font-bold text-lg tracking-tighter $1">habisrilis<span className="text-gray-600">.web.id</span></span>'
  );

  content = content.replace(
    /<span className="font-bold text-lg tracking-tighter lowercase">habisrilis<span className="text-gray-600">\.web\.id<\/span><\/span>/g,
    '<span className="font-bold text-lg tracking-tighter">habisrilis<span className="text-gray-600">.web.id</span></span>'
  );
  
  // If there are still any uppercase ones missed
  content = content.replace(
    /<span className="font-bold text-lg tracking-tighter uppercase (.*?)">habisrilis\.web\.id<\/span>/g,
    '<span className="font-bold text-lg tracking-tighter $1">habisrilis<span className="text-gray-600">.web.id</span></span>'
  );

  content = content.replace(
    /<span className="font-bold text-lg tracking-tighter uppercase">habisrilis\.web\.id<\/span>/g,
    '<span className="font-bold text-lg tracking-tighter">habisrilis<span className="text-gray-600">.web.id</span></span>'
  );
  
  // Fix the previously patched landing page
  content = content.replace(
    /<span className="font-bold text-lg tracking-tighter hidden sm:block">habisrilis<span className="text-gray-500">\.web\.id<\/span><\/span>/g,
    '<span className="font-bold text-lg tracking-tighter hidden sm:block">habisrilis<span className="text-gray-600">.web.id</span></span>'
  );

  fs.writeFileSync(filePath, content);
}

replaceBranding('src/components/layout/AppShell.tsx');
replaceBranding('src/pages/public/LandingPage.tsx');

