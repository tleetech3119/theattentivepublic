DELETE FROM public.user_preferences WHERE user_id IS NULL;
ALTER TABLE public.user_preferences ALTER COLUMN user_id SET NOT NULL;