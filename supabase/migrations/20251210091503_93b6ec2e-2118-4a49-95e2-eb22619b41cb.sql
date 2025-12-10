-- Add arrival and departure time columns to locations table for office status
ALTER TABLE public.locations
ADD COLUMN arrival_time time DEFAULT NULL,
ADD COLUMN departure_time time DEFAULT NULL;