const fs = require('fs');

function replaceLogo(filePath) {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf-8');
    content = content.replace(
      /https:\/\/res\.cloudinary\.com\/dvy4znkvy\/image\/upload\/v1785567114\/h_2_a2ldzp\.png/g,
      'https://res.cloudinary.com/dvy4znkvy/image/upload/v1786332080/h_4_sxrvod.png'
    );
    fs.writeFileSync(filePath, content);
  }
}

replaceLogo('src/components/layout/AppShell.tsx');
replaceLogo('src/pages/public/LandingPage.tsx');

