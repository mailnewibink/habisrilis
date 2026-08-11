import { supabase } from './src/lib/supabase';

async function test() {
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    console.log("Logged in as", user.id);
  } else {
    console.log("Not logged in");
  }
}
test();
