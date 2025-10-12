-- Allow public read access to the public-assets bucket
-- This allows anyone to view files, which is needed for avatars.
CREATE POLICY "Public read access for files in public-assets"
ON storage.objects FOR SELECT
USING ( bucket_id = 'public-assets' );

-- Allow authenticated users to upload files to the 'avatars' folder
-- This policy checks that the file path starts with 'avatars/' and the user's ID.
CREATE POLICY "Authenticated users can upload avatars"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'public-assets' AND
  name LIKE 'avatars/' || auth.uid() || '%'
);

-- Allow authenticated users to update their own files in the 'avatars' folder
-- This is needed because the upload function might update an existing file.
CREATE POLICY "Authenticated users can update their own avatars"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'public-assets' AND
  name LIKE 'avatars/' || auth.uid() || '%'
);

-- Allow authenticated users to delete their own files in the 'avatars' folder
CREATE POLICY "Authenticated users can delete their own avatars"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'public-assets' AND
  name LIKE 'avatars/' || auth.uid() || '%'
);