const fs = require('fs');

const filesToPatch = [
  'src/pages/app/MyReleases.tsx',
  'src/pages/app/CreateRelease.tsx',
  'src/pages/app/EditRelease.tsx',
  'src/pages/app/Account.tsx',
  'src/pages/app/ArtistSetup.tsx',
  'src/pages/app/ClaimArtistDiscovery.tsx',
  'src/pages/app/AdminClaims.tsx',
  'src/pages/app/AdminFeatured.tsx',
  'src/pages/app/Onboarding.tsx',
  'src/pages/app/ManagerDashboard.tsx',
  'src/pages/app/FanDashboard.tsx',
  'src/components/layout/AppShell.tsx'
];

filesToPatch.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf-8');
    if (!content.includes('useLanguage')) {
      content = content.replace("import React", "import { useLanguage } from '../../contexts/LanguageContext';\nimport React");
      
      // Attempt to inject t safely
      content = content.replace(/(export const \w+ = \([^)]*\) => \{|export default function \w+\([^)]*\) \{)/, "$1\n  const { t } = useLanguage();\n");
      fs.writeFileSync(file, content);
    }
  }
});

let appShell = fs.readFileSync('src/components/layout/AppShell.tsx', 'utf-8');
appShell = appShell.replace(/>Sign Out</g, ">{t('dashboard.signOut')}<");
appShell = appShell.replace(/>Dashboard</g, ">{t('dashboard.title')}<");
appShell = appShell.replace(/>My Releases</g, ">{t('dashboard.myReleases')}<");
appShell = appShell.replace(/>Account</g, ">{t('dashboard.account')}<");
fs.writeFileSync('src/components/layout/AppShell.tsx', appShell);

let myReleases = fs.readFileSync('src/pages/app/MyReleases.tsx', 'utf-8');
myReleases = myReleases.replace(/>My Releases</g, ">{t('dashboard.myReleases')}<");
myReleases = myReleases.replace(/>Create Release</g, ">{t('dashboard.createRelease')}<");
myReleases = myReleases.replace(/>No releases yet\.</g, ">{t('dashboard.noReleases')}<");
myReleases = myReleases.replace(/>Create your first release to share your music with the world\.</g, ">{t('dashboard.noReleasesDesc')}<");
fs.writeFileSync('src/pages/app/MyReleases.tsx', myReleases);

let fanDashboard = fs.readFileSync('src/pages/app/FanDashboard.tsx', 'utf-8');
fanDashboard = fanDashboard.replace(/>Fan Dashboard</g, ">{t('dashboard.fanDashboard')}<");
fanDashboard = fanDashboard.replace(/>Sign Out</g, ">{t('dashboard.signOut')}<");
fanDashboard = fanDashboard.replace(/>Following</g, ">{t('dashboard.following')}<");
fanDashboard = fanDashboard.replace(/>Recent Updates</g, ">{t('dashboard.recentUpdates')}<");
fanDashboard = fanDashboard.replace(/>Discover Artists</g, ">{t('dashboard.discoverArtists')}<");
fanDashboard = fanDashboard.replace(/>Not following any artists yet\.</g, ">{t('dashboard.noFollowing')}<");
fanDashboard = fanDashboard.replace(/>Discover and follow your favorite artists to see their latest releases here\.</g, ">{t('dashboard.noFollowingDesc')}<");
fanDashboard = fanDashboard.replace(/>No updates yet\.</g, ">{t('dashboard.noUpdates')}<");
fs.writeFileSync('src/pages/app/FanDashboard.tsx', fanDashboard);

let artistDashboard = fs.readFileSync('src/pages/app/ManagerDashboard.tsx', 'utf-8');
artistDashboard = artistDashboard.replace(/>Artist Dashboard</g, ">{t('dashboard.artistDashboard')}<");
artistDashboard = artistDashboard.replace(/>Sign Out</g, ">{t('dashboard.signOut')}<");
fs.writeFileSync('src/pages/app/ManagerDashboard.tsx', artistDashboard);

let formComponent = fs.readFileSync('src/components/release/ReleaseForm.tsx', 'utf-8');
if (!formComponent.includes('useLanguage')) {
  formComponent = formComponent.replace("import React", "import { useLanguage } from '../../contexts/LanguageContext';\nimport React");
  formComponent = formComponent.replace("export const ReleaseForm = ({ initialData, onSubmit, loading = false, submitLabel = 'Save Release' }: ReleaseFormProps) => {", "export const ReleaseForm = ({ initialData, onSubmit, loading = false, submitLabel = 'Save Release' }: ReleaseFormProps) => {\n  const { t } = useLanguage();");
  formComponent = formComponent.replace(/>Release Title</g, ">{t('form.title')}<");
  formComponent = formComponent.replace(/>Description</g, ">{t('form.description')}<");
  formComponent = formComponent.replace(/>Release Type</g, ">{t('form.releaseType')}<");
  formComponent = formComponent.replace(/>Release Date</g, ">{t('form.releaseDate')}<");
  formComponent = formComponent.replace(/>Streaming Links</g, ">{t('form.streamingLinks')}<");
  formComponent = formComponent.replace(/>Social Links</g, ">{t('form.socialLinks')}<");
  formComponent = formComponent.replace(/>Add Link</g, ">{t('form.addLink')}<");
  formComponent = formComponent.replace(/>Remove</g, ">{t('form.remove')}<");
  formComponent = formComponent.replace(/>\(Optional\)</g, ">{t('form.optional')}<");
  formComponent = formComponent.replace(/>\(Required\)</g, ">{t('form.required')}<");
  fs.writeFileSync('src/components/release/ReleaseForm.tsx', formComponent);
}

