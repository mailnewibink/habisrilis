create table public.artist_followers (
  id uuid default gen_random_uuid() primary key,
  artist_id uuid references public.artists(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(artist_id, user_id)
);

alter table public.artist_followers enable row level security;

create policy "Artist followers are viewable by everyone"
  on public.artist_followers for select
  using (true);

create policy "Users can follow artists"
  on public.artist_followers for insert
  with check (auth.uid() = user_id);

create policy "Users can unfollow artists"
  on public.artist_followers for delete
  using (auth.uid() = user_id);
