-- Add country column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN country text;

-- Create an enum-like constraint for valid countries
ALTER TABLE public.profiles 
ADD CONSTRAINT valid_country 
CHECK (country IS NULL OR country IN ('argentina', 'brasil', 'chile', 'colombia', 'eua'));