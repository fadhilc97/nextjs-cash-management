ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;--> statement-breakpoint

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;--> statement-breakpoint

CREATE POLICY "categories_owner_all" ON public.categories
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);--> statement-breakpoint

CREATE POLICY "transactions_owner_all" ON public.transactions
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
