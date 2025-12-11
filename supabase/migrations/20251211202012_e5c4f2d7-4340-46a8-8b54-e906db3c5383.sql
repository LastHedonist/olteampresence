-- Drop the existing restrictive update policy
DROP POLICY IF EXISTS "Users can validate others check-ins" ON public.office_checkins;

-- Create new policy allowing Admin/Lead to validate any check-in
CREATE POLICY "Users can validate others check-ins"
ON public.office_checkins
FOR UPDATE
TO authenticated
USING (
    user_id != auth.uid() -- Cannot validate own check-in
    AND validated_by IS NULL -- Only validate if not already validated
)
WITH CHECK (
    user_id != auth.uid() -- Cannot validate own check-in
);