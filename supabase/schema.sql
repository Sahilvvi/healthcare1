-- Dadashri Vishwa Healthcare — Supabase schema (public schema, dv_ prefix)
-- Run against the selected Supabase project via the Management API query endpoint.

CREATE TABLE IF NOT EXISTS public.dv_profiles (
  id uuid PRIMARY KEY,
  role text NOT NULL DEFAULT 'PATIENT',
  name text NOT NULL,
  phone text,
  country text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.dv_doctors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  specialty text,
  experience text,
  rating numeric,
  procedures text,
  languages text[],
  qualifications text[],
  expertise text[],
  about text,
  availability text,
  hospitals text[],
  image text
);

CREATE TABLE IF NOT EXISTS public.dv_hospitals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  city text,
  country text,
  image text,
  beds text,
  about text,
  accreditations text[],
  specialties text[],
  facilities text[]
);

CREATE TABLE IF NOT EXISTS public.dv_packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  country text,
  price text,
  stay text,
  specialty text,
  includes text[],
  description text,
  hospitals text[]
);

CREATE TABLE IF NOT EXISTS public.dv_cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL REFERENCES public.dv_profiles(id) ON DELETE CASCADE,
  category text,
  condition text,
  previous_treatment text,
  city text,
  country text,
  status text NOT NULL DEFAULT 'NEW',
  coordinator_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.dv_case_timeline (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid NOT NULL REFERENCES public.dv_cases(id) ON DELETE CASCADE,
  stage text NOT NULL,
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.dv_case_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid NOT NULL REFERENCES public.dv_cases(id) ON DELETE CASCADE,
  doctor_id uuid,
  note text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.dv_appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid REFERENCES public.dv_cases(id) ON DELETE CASCADE,
  doctor_id uuid REFERENCES public.dv_doctors(id) ON DELETE SET NULL,
  type text NOT NULL,
  scheduled_at timestamptz,
  status text NOT NULL DEFAULT 'SCHEDULED',
  link text
);

CREATE TABLE IF NOT EXISTS public.dv_travel_itineraries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid UNIQUE NOT NULL REFERENCES public.dv_cases(id) ON DELETE CASCADE,
  visa_docs jsonb,
  accommodation text,
  coordinator_contact text
);

CREATE TABLE IF NOT EXISTS public.dv_travel_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  itinerary_id uuid NOT NULL REFERENCES public.dv_travel_itineraries(id) ON DELETE CASCADE,
  date text,
  title text,
  detail text
);

CREATE TABLE IF NOT EXISTS public.dv_medicine_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL REFERENCES public.dv_profiles(id) ON DELETE CASCADE,
  case_id uuid REFERENCES public.dv_cases(id) ON DELETE SET NULL,
  items jsonb,
  status text NOT NULL DEFAULT 'PENDING',
  total text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.dv_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL REFERENCES public.dv_profiles(id) ON DELETE CASCADE,
  case_id uuid REFERENCES public.dv_cases(id) ON DELETE SET NULL,
  label text NOT NULL,
  url text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.dv_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid NOT NULL REFERENCES public.dv_cases(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Allow Supabase Auth roles and service role to use the tables.
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;

-- Row-level security policies
ALTER TABLE public.dv_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dv_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dv_case_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dv_case_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dv_appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dv_travel_itineraries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dv_travel_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dv_medicine_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dv_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dv_messages ENABLE ROW LEVEL SECURITY;

-- Public read for doctors, hospitals and packages
CREATE POLICY allow_public_select_doctors ON public.dv_doctors FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY allow_public_select_hospitals ON public.dv_hospitals FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY allow_public_select_packages ON public.dv_packages FOR SELECT TO anon, authenticated USING (true);

-- Users can only manage their own profile and own cases/journey
CREATE POLICY users_select_own_profile ON public.dv_profiles FOR SELECT TO authenticated USING (id = auth.uid());
CREATE POLICY users_insert_own_profile ON public.dv_profiles FOR INSERT TO authenticated WITH CHECK (id = auth.uid());
CREATE POLICY users_update_own_profile ON public.dv_profiles FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());

CREATE POLICY users_select_own_case ON public.dv_cases FOR SELECT TO authenticated USING (patient_id = auth.uid());
CREATE POLICY users_insert_own_case ON public.dv_cases FOR INSERT TO authenticated WITH CHECK (patient_id = auth.uid());
CREATE POLICY users_update_own_case ON public.dv_cases FOR UPDATE TO authenticated USING (patient_id = auth.uid()) WITH CHECK (patient_id = auth.uid());

CREATE POLICY users_select_own_timeline ON public.dv_case_timeline FOR SELECT TO authenticated USING (case_id IN (SELECT id FROM public.dv_cases WHERE patient_id = auth.uid()));
CREATE POLICY users_select_own_notes ON public.dv_case_notes FOR SELECT TO authenticated USING (case_id IN (SELECT id FROM public.dv_cases WHERE patient_id = auth.uid()));
CREATE POLICY users_select_own_appointments ON public.dv_appointments FOR SELECT TO authenticated USING (case_id IN (SELECT id FROM public.dv_cases WHERE patient_id = auth.uid()));
CREATE POLICY users_select_own_itinerary ON public.dv_travel_itineraries FOR SELECT TO authenticated USING (case_id IN (SELECT id FROM public.dv_cases WHERE patient_id = auth.uid()));
CREATE POLICY users_select_own_travel_events ON public.dv_travel_events FOR SELECT TO authenticated USING (itinerary_id IN (SELECT id FROM public.dv_travel_itineraries WHERE case_id IN (SELECT id FROM public.dv_cases WHERE patient_id = auth.uid())));
CREATE POLICY users_select_own_orders ON public.dv_medicine_orders FOR SELECT TO authenticated USING (patient_id = auth.uid());
CREATE POLICY users_select_own_documents ON public.dv_documents FOR SELECT TO authenticated USING (patient_id = auth.uid());
CREATE POLICY users_select_own_messages ON public.dv_messages FOR SELECT TO authenticated USING (case_id IN (SELECT id FROM public.dv_cases WHERE patient_id = auth.uid()));

CREATE TABLE IF NOT EXISTS public.dv_contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.dv_contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dv_contact_submissions FORCE ROW LEVEL SECURITY;

CREATE POLICY allow_anon_insert_contact ON public.dv_contact_submissions FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY allow_service_all_contact ON public.dv_contact_submissions FOR ALL TO service_role USING (true) WITH CHECK (true);

GRANT ALL ON public.dv_contact_submissions TO anon, authenticated, service_role;
