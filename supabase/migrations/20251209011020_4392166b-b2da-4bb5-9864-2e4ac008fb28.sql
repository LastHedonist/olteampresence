-- Drop existing policies on locations
DROP POLICY IF EXISTS "Authenticated users can view all locations" ON public.locations;
DROP POLICY IF EXISTS "Users can manage their own locations" ON public.locations;

-- Create clean, explicit policies
CREATE POLICY "Authenticated users can view all locations"
ON public.locations FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can insert own locations"
ON public.locations FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own locations"
ON public.locations FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can delete own locations"
ON public.locations FOR DELETE
TO authenticated
USING (user_id = auth.uid());