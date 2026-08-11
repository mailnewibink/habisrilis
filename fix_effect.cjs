const fs = require('fs');
let content = fs.readFileSync('src/auth/AuthContext.tsx', 'utf-8');

const brokenEffect = `        if (currentUserId.current !== supabaseUser.id) {
          setLoading(true);
          setArtistLoading(true);
          setUser(supabaseUser);
          currentUserId.current = supabaseUser.id;
          await fetchArtistProfile(supabaseUser.id);
        } else {
          setUser(supabaseUser);
        }`;

const fixedEffect = `        if (currentUserId.current !== supabaseUser.id) {
          setLoading(true);
          setArtistLoading(true);
          
          currentUserId.current = supabaseUser.id;
          
          const [actualPlan] = await Promise.all([
            fetchUserPlan(),
            fetchArtistProfile(supabaseUser.id)
          ]);
          
          if (mounted) {
            setUser({ ...supabaseUser, plan: actualPlan as 'free' | 'manager_pro' });
          }
        } else {
          setUser(prev => prev ? { ...supabaseUser, plan: prev.plan } : supabaseUser);
        }`;

content = content.replace(brokenEffect, fixedEffect);
fs.writeFileSync('src/auth/AuthContext.tsx', content);
