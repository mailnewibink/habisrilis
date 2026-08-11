-- Remove 'plan' from raw_user_meta_data for all users
UPDATE auth.users
SET raw_user_meta_data = raw_user_meta_data - 'plan'
WHERE raw_user_meta_data ? 'plan';
