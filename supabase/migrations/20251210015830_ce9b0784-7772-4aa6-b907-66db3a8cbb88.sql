-- Create enum for resource groups
CREATE TYPE public.resource_group AS ENUM ('head', 'lead', 'equipe');

-- Add group column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN resource_group resource_group NOT NULL DEFAULT 'equipe';