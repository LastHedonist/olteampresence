-- Add job_function column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN job_function text NOT NULL DEFAULT 'Não definido';

-- Add comment for documentation
COMMENT ON COLUMN public.profiles.job_function IS 'Job function/role of the employee (e.g., Developer, Designer, Manager)';