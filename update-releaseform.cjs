const fs = require('fs');
let code = fs.readFileSync('src/components/release/ReleaseForm.tsx', 'utf-8');

if (!code.includes("ImageUpload")) {
  code = code.replace(
    `import { Toggle } from '../ui/Toggle';`,
    `import { Toggle } from '../ui/Toggle';\nimport { ImageUpload } from './ImageUpload';`
  );
}

const targetArtwork = `
          <div>
            <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Artwork URL</label>
            <Input 
              value={data.artworkUrl || ''} 
              onChange={e => onChange({ ...data, artworkUrl: e.target.value })}
              placeholder="https://..." 
            />
          </div>`;

const replaceArtwork = `
          <div>
            <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Artwork</label>
            <ImageUpload 
              value={data.artworkUrl || ''} 
              onChange={url => onChange({ ...data, artworkUrl: url })}
            />
          </div>`;

code = code.replace(targetArtwork.trim(), replaceArtwork.trim());

fs.writeFileSync('src/components/release/ReleaseForm.tsx', code);
