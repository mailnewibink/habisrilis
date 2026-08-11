const fs = require('fs');

const data = {
  id: {
    proTitleMonthly: "Manager Pro Bulanan",
    proCtaMonthly: "Upgrade ke Pro",
    proTitleYearly: "Manager Pro Tahunan",
    proCtaYearly: "Segera Hadir",
    saveAnnual: "Hemat Rp129.000/tahun"
  },
  en: {
    proTitleMonthly: "Manager Pro Monthly",
    proCtaMonthly: "Upgrade to Pro",
    proTitleYearly: "Manager Pro Yearly",
    proCtaYearly: "Coming Soon",
    saveAnnual: "Save Rp129,000/year"
  }
};

let content = fs.readFileSync('src/lib/i18n/translations.ts', 'utf8');

// The file exports `translations` object containing `id` and `en`.
// We can just parse and stringify if it was JSON, but it's a TS file.
// Let's just do targeted replaces for id and en sections.

content = content.replace(
  /proTitle: 'MANAGER PRO',/g,
  function(match, offset, string) {
    // If it's the first occurrence (id), return the id keys. If second (en), return en keys.
    const isId = offset < string.indexOf('en: {');
    const lang = isId ? data.id : data.en;
    return `proTitle: 'MANAGER PRO',
      proTitleMonthly: '${lang.proTitleMonthly}',
      proCtaMonthly: '${lang.proCtaMonthly}',
      proTitleYearly: '${lang.proTitleYearly}',
      proCtaYearly: '${lang.proCtaYearly}',
      saveAnnual: '${lang.saveAnnual}',`;
  }
);

// We need to clean up my previous failed attempt. Let me first read the original file.
