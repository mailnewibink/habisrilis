const fs = require('fs');
let content = fs.readFileSync('src/auth/AuthContext.tsx', 'utf-8');

const interfaceOld = `  refreshArtistProfile: () => Promise<void>;
  updateUserAccountType: (accountType: 'artist' | 'manager' | 'fan', plan?: 'free' | 'manager_pro') => Promise<void>;`;
const interfaceNew = `  refreshArtistProfile: () => Promise<void>;
  updateUserAccountType: (accountType: 'artist' | 'manager' | 'fan') => Promise<void>;
  refreshPlan: () => Promise<void>;`;
content = content.replace(interfaceOld, interfaceNew);

const fetchPlanFunc = `  const fetchUserPlan = async () => {
    try {
      const { data, error } = await supabase.rpc('get_current_plan');
      if (error) {
        console.error('Error fetching plan:', error);
        return 'free';
      }
      return data || 'free';
    } catch (err) {
      console.error('Error fetching plan:', err);
      return 'free';
    }
  };`;

// We'll insert it before fetchArtistProfile
content = content.replace("  const fetchArtistProfile = async (uid: string) => {", fetchPlanFunc + "\n\n  const fetchArtistProfile = async (uid: string) => {");

const effectOld = `  useEffect(() => {
    let mounted = true;

    const { data: authListener } = onAuthStateChange(async (supabaseUser) => {
      if (!mounted) return;

      if (supabaseUser) {
        if (currentUserId.current !== supabaseUser.id) {
          setLoading(true);
          setArtistLoading(true);
          setUser(supabaseUser);
          currentUserId.current = supabaseUser.id;
          await fetchArtistProfile(supabaseUser.id);
        } else {
          setUser(supabaseUser);
        }
      } else {
        setUser(null);
        setArtists([]);
        setActiveArtistIdState(null);
        currentUserId.current = null;
        if (mounted) {
          setArtistLoading(false);
        }
      }
      
      if (mounted) {
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);`;

const effectNew = `  useEffect(() => {
    let mounted = true;

    const { data: authListener } = onAuthStateChange(async (supabaseUser) => {
      if (!mounted) return;

      if (supabaseUser) {
        if (currentUserId.current !== supabaseUser.id) {
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
          // Token refresh or other event, keep existing plan if we already have it
          setUser(prev => prev ? { ...supabaseUser, plan: prev.plan } : supabaseUser);
        }
      } else {
        setUser(null);
        setArtists([]);
        setActiveArtistIdState(null);
        currentUserId.current = null;
        if (mounted) {
          setArtistLoading(false);
        }
      }
      
      if (mounted) {
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);`;

content = content.replace(effectOld, effectNew);

const handleUpdateOld = `  const handleUpdateUserAccountType = async (accountType: 'artist' | 'manager' | 'fan', plan: 'free' | 'manager_pro' = 'free') => {
    await updateAccountType(accountType, plan);
    if (user) {
      setUser({ ...user, accountType, plan });
    }
  };`;

const handleUpdateNew = `  const handleUpdateUserAccountType = async (accountType: 'artist' | 'manager' | 'fan') => {
    await updateAccountType(accountType);
    if (user) {
      setUser({ ...user, accountType });
    }
  };

  const refreshPlan = async () => {
    if (user) {
      const actualPlan = await fetchUserPlan();
      setUser({ ...user, plan: actualPlan as 'free' | 'manager_pro' });
    }
  };`;

content = content.replace(handleUpdateOld, handleUpdateNew);

const providerOld = `      refreshArtistProfile, 
      updateUserAccountType: handleUpdateUserAccountType`;

const providerNew = `      refreshArtistProfile, 
      updateUserAccountType: handleUpdateUserAccountType,
      refreshPlan`;

content = content.replace(providerOld, providerNew);

fs.writeFileSync('src/auth/AuthContext.tsx', content);
