-- Rich panels migration
-- Adds doctor-auth linking, prescriptions, support tickets, transactions and policies.

ALTER TABLE public.dv_doctors ADD COLUMN IF NOT EXISTS user_id uuid;

CREATE TABLE IF NOT EXISTS public.dv_prescriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid REFERENCES public.dv_cases(id) ON DELETE CASCADE,
  patient_id uuid NOT NULL,
  doctor_id uuid,
  medications jsonb NOT NULL DEFAULT '[]'::jsonb,
  notes text,
  status text NOT NULL DEFAULT 'ACTIVE',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.dv_support_tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'OPEN',
  priority text NOT NULL DEFAULT 'MEDIUM',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.dv_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('income','cost','refund')),
  category text,
  amount numeric NOT NULL CHECK (amount >= 0),
  currency text NOT NULL DEFAULT 'USD',
  description text,
  case_id uuid REFERENCES public.dv_cases(id) ON DELETE SET NULL,
  patient_id uuid,
  doctor_id uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT ALL ON public.dv_prescriptions TO anon, authenticated, service_role;
GRANT ALL ON public.dv_support_tickets TO anon, authenticated, service_role;
GRANT ALL ON public.dv_transactions TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;

ALTER TABLE public.dv_prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dv_support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dv_transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS users_select_own_prescriptions ON public.dv_prescriptions;
CREATE POLICY users_select_own_prescriptions ON public.dv_prescriptions FOR SELECT TO authenticated USING (patient_id = auth.uid());

DROP POLICY IF EXISTS users_select_own_support_tickets ON public.dv_support_tickets;
CREATE POLICY users_select_own_support_tickets ON public.dv_support_tickets FOR SELECT TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS users_select_own_transactions ON public.dv_transactions;
CREATE POLICY users_select_own_transactions ON public.dv_transactions FOR SELECT TO authenticated USING (patient_id = auth.uid());

DROP POLICY IF EXISTS doctors_select_prescriptions ON public.dv_prescriptions;
CREATE POLICY doctors_select_prescriptions ON public.dv_prescriptions FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.dv_profiles WHERE id = auth.uid() AND role IN ('doctor','admin','superadmin'))
);

DROP POLICY IF EXISTS admin_all_support_tickets ON public.dv_support_tickets;
CREATE POLICY admin_all_support_tickets ON public.dv_support_tickets FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.dv_profiles WHERE id = auth.uid() AND role IN ('admin','superadmin'))
);

DROP POLICY IF EXISTS admin_all_transactions ON public.dv_transactions;
CREATE POLICY admin_all_transactions ON public.dv_transactions FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.dv_profiles WHERE id = auth.uid() AND role IN ('admin','superadmin'))
);

CREATE TABLE IF NOT EXISTS public.dv_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.dv_settings ENABLE ROW LEVEL SECURITY;
GRANT ALL ON public.dv_settings TO anon, authenticated, service_role;

DROP POLICY IF EXISTS admin_all_settings ON public.dv_settings;
CREATE POLICY admin_all_settings ON public.dv_settings FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.dv_profiles WHERE id = auth.uid() AND role IN ('admin','superadmin'))
);
