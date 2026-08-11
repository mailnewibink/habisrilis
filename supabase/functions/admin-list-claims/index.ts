import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.47.10"
import { corsHeaders } from "../_shared/cors.ts"

serve(async (req) => {
  // 1. Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  
  // 2. Require GET (or POST, depending on caller, but GET makes sense for a list, allow GET and POST)
  if (req.method !== 'GET' && req.method !== 'POST') { 
     return new Response(JSON.stringify({ error: 'Method not allowed' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 405 })
  }

  try {
    // 3. Require Authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Authentication required' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 })
    }

    // 4. Verify Supabase user
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )

    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser()

    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Authentication required' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 })
    }

    // 5. Verify user.email === "mailnewibink@gmail.com"
    if (user.email !== 'mailnewibink@gmail.com') {
       return new Response(JSON.stringify({ error: 'Admin access required' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 })
    }

    // 6. Create server-side Supabase client using service_role
    const secretKeys = JSON.parse(Deno.env.get('SUPABASE_SECRET_KEYS') || '{}')
    
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      secretKeys['default'] ?? ''
    )

    // 7. Query artist_claims joined with artists
    const { data, error } = await supabaseAdmin
      .from('artist_claims')
      .select(`
        *,
        artists (
          display_name,
          username,
          avatar_url,
          verification_status
        )
      `)
      .order('created_at', { ascending: false })

    // 8. If query fails
    if (error) {
      console.error('List claims query error:', error)
      return new Response(JSON.stringify({ error: error.message || 'Error listing claims' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    // 9. If successful
    return new Response(JSON.stringify({ data }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error: any) {
    console.error('Edge function error:', error)
    return new Response(JSON.stringify({ error: error.message || 'Internal server error' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
