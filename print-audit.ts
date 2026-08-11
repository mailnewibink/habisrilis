console.log(`
1. Exact file: src/auth/AuthContext.tsx
2. Exact function: AuthProvider's useEffect onAuthStateChange callback
3. When is getArtistsByUserId() called? 
   Called inside fetchArtistProfile, which is awaited inside the onAuthStateChange callback.
4. When is loading changed from true → false?
   It is changed to false SYNCHRONOUSLY at the end of the onAuthStateChange callback. Because the callback is marked async, any await (like await fetchArtistProfile) pauses the execution of the callback, but Supabase's onAuthStateChange event emitter does NOT await the callback. The event listener fires, hits the await, yields control back, and then later completes. But wait! If it yields, setLoading(false) is called AFTER the await finishes. 
   WAIT. Let me check the code.
`);
