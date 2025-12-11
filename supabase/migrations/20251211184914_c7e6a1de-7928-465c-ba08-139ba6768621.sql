-- Drop and recreate get_team_profiles function to include resource_group
DROP FUNCTION IF EXISTS public.get_team_profiles();

CREATE FUNCTION public.get_team_profiles()
RETURNS TABLE (
  id uuid,
  full_name text,
  avatar_url text,
  is_active boolean,
  resource_group resource_group
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    p.id,
    p.full_name,
    p.avatar_url,
    p.is_active,
    p.resource_group
  FROM public.profiles p
  WHERE p.is_active = true
$$;