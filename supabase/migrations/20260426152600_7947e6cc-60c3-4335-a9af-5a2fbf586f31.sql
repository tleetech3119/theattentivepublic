
-- Tighten bill_notifications policies to authenticated role
DROP POLICY IF EXISTS "Users view their own notifications" ON public.bill_notifications;
DROP POLICY IF EXISTS "Users create their own notifications" ON public.bill_notifications;
DROP POLICY IF EXISTS "Users update their own notifications" ON public.bill_notifications;
DROP POLICY IF EXISTS "Users delete their own notifications" ON public.bill_notifications;

CREATE POLICY "Users view their own notifications"
  ON public.bill_notifications FOR SELECT TO authenticated
  USING (auth.uid() = user_id);
CREATE POLICY "Users create their own notifications"
  ON public.bill_notifications FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update their own notifications"
  ON public.bill_notifications FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);
CREATE POLICY "Users delete their own notifications"
  ON public.bill_notifications FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- Tighten bill_watches policies to authenticated role
DROP POLICY IF EXISTS "Users view their own watches" ON public.bill_watches;
DROP POLICY IF EXISTS "Users create their own watches" ON public.bill_watches;
DROP POLICY IF EXISTS "Users update their own watches" ON public.bill_watches;
DROP POLICY IF EXISTS "Users delete their own watches" ON public.bill_watches;

CREATE POLICY "Users view their own watches"
  ON public.bill_watches FOR SELECT TO authenticated
  USING (auth.uid() = user_id);
CREATE POLICY "Users create their own watches"
  ON public.bill_watches FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update their own watches"
  ON public.bill_watches FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);
CREATE POLICY "Users delete their own watches"
  ON public.bill_watches FOR DELETE TO authenticated
  USING (auth.uid() = user_id);
