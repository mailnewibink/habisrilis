const fs = require('fs');

let content = fs.readFileSync('src/components/release/ReleaseCard.tsx', 'utf-8');

// Replace the Link wrapper with a standard div that uses useNavigate
// First, import useNavigate
content = content.replace(
  "import { Link } from 'react-router-dom';",
  "import { Link, useNavigate } from 'react-router-dom';"
);

// Then, add useNavigate hook
content = content.replace(
  "const [isLightboxOpen, setIsLightboxOpen] = useState(false);",
  "const [isLightboxOpen, setIsLightboxOpen] = useState(false);\n  const navigate = useNavigate();"
);

// Modify the content div to handle clicks
content = content.replace(
  '<div className="group relative flex flex-col w-full max-w-sm mx-auto bg-white border border-gray-200 p-4 rounded-[14px] shadow-sm hover:shadow-md transition-all hover:scale-[1.01] active:scale-[0.99]">',
  '<div \n      onClick={() => { if (slug && artistUsername) navigate(`/@${artistUsername}/${slug}`); }}\n      className={`group relative flex flex-col w-full max-w-sm mx-auto bg-white border border-gray-200 p-4 rounded-[14px] shadow-sm hover:shadow-md transition-all hover:scale-[1.01] active:scale-[0.99] ${slug && artistUsername ? "cursor-pointer" : ""}`}\n    >'
);

// Finally, remove the Link wrapper from the return
content = content.replace(
  /return \(\s*<>\s*\{slug && artistUsername \? \(\s*<Link to=\{`\/@\$\{artistUsername\}\/\$\{slug\}`\} className="block">\s*\{content\}\s*<\/Link>\s*\) : \(\s*content\s*\)\}\s*\{lightbox\}\s*<\/>\s*\);/m,
  "return (\n    <>\n      {content}\n      {lightbox}\n    </>\n  );"
);

fs.writeFileSync('src/components/release/ReleaseCard.tsx', content);
