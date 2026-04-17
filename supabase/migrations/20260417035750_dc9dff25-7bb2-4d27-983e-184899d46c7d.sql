-- Tighten user_preferences RLS: require authentication and ownership
ALTER TABLE public.user_preferences
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

-- Drop old open policies
DROP POLICY IF EXISTS "Anyone can read preferences" ON public.user_preferences;
DROP POLICY IF EXISTS "Anyone can insert preferences" ON public.user_preferences;
DROP POLICY IF EXISTS "Anyone can update preferences" ON public.user_preferences;

-- New owner-scoped policies
CREATE POLICY "Users view their own preferences"
ON public.user_preferences
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users insert their own preferences"
ON public.user_preferences
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update their own preferences"
ON public.user_preferences
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users delete their own preferences"
ON public.user_preferences
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON public.user_preferences(user_id);