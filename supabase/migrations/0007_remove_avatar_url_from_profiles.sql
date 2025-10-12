-- Remove avatar_url column from profiles table
ALTER TABLE public.profiles DROP COLUMN IF EXISTS avatar_url;

-- Drop avatar-related storage policies since they're no longer needed
DROP POLICY IF EXISTS "Authenticated users can upload avatars" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update their own avatars" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete their own avatars" ON storage.objects;
