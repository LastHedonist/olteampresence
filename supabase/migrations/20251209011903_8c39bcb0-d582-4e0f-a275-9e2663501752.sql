-- Add DELETE policy for profiles table (GDPR compliance)
CREATE POLICY "Users can delete own profile or admins can delete any"
ON public.profiles FOR DELETE
USING (auth.uid() = id OR has_role(auth.uid(), 'admin'::app_role));