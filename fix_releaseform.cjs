const fs = require('fs');
let content = fs.readFileSync('src/components/release/ReleaseForm.tsx', 'utf-8');
content = content.replace(
  "export const ReleaseForm = ({ data, onChange }: ReleaseFormProps) => {",
  "export const ReleaseForm = ({ data, onChange }: ReleaseFormProps) => {\n  const { t } = useLanguage();"
);
fs.writeFileSync('src/components/release/ReleaseForm.tsx', content);
