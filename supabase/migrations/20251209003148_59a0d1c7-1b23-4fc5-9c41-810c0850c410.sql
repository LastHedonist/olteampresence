-- Drop the view and recreate with SECURITY INVOKER (uses the querying user's permissions)
DROP VIEW IF EXISTS public.public_profiles;

CREATE VIEW public.public_profiles 
WITH (security_invoker = true)
AS
SELECT 
  id,
  full_name,
  avatar_url,
  is_active,
  created_at
FROM public.profiles;

-- Grant access to the view for authenticated users
GRANT SELECT ON public.public_profiles TO authenticated;

-- We need to allow authenticated users to see the base profiles table
-- but only specific columns - let's use a function instead
CREATE OR REPLACE FUNCTION public.get_team_profiles()
RETURNS TABLE (
  id uuid,
  full_name text,
  avatar_url text,
  is_active boolean
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id, full_name, avatar_url, is_active
  FROM public.profiles
  WHERE is_active = true;
$$;