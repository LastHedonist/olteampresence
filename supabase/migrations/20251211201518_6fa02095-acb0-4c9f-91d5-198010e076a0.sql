-- Create table for office check-ins with peer validation
CREATE TABLE public.office_checkins (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    checked_in_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    validated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    validated_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, date)
);

-- Enable RLS
ALTER TABLE public.office_checkins ENABLE ROW LEVEL SECURITY;

-- Everyone can view check-ins (needed for validation flow)
CREATE POLICY "Authenticated users can view all check-ins"
ON public.office_checkins
FOR SELECT
TO authenticated
USING (true);

-- Users can insert their own check-in
CREATE POLICY "Users can insert own check-in"
ON public.office_checkins
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Users can update check-ins to validate others (but not self-validate)
CREATE POLICY "Users can validate others check-ins"
ON public.office_checkins
FOR UPDATE
TO authenticated
USING (
    user_id != auth.uid() -- Cannot validate own check-in
    AND validated_by IS NULL -- Only validate if not already validated
);

-- Users can delete their own check-in
CREATE POLICY "Users can delete own check-in"
ON public.office_checkins
FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- Enable realtime for check-ins
ALTER PUBLICATION supabase_realtime ADD TABLE public.office_checkins;