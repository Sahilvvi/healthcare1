export interface Doctor {
  id: string;
  slug: string;
  name: string;
  specialty: string;
  experience: string;
  rating: number | null;
  procedures: string;
  languages: string[];
  qualifications: string[];
  expertise: string[];
  about: string;
  availability: string;
  hospitals: string[];
  image: string;
}

export interface Hospital {
  id: string;
  slug: string;
  name: string;
  city: string | null;
  country: string | null;
  image: string;
  beds: string | null;
  about: string | null;
  accreditations: string[];
  specialties: string[];
  facilities: string[];
}

export interface Package {
  id: string;
  slug: string;
  name: string;
  country: string | null;
  price: string | null;
  stay: string | null;
  specialty: string | null;
  includes: string[];
  description: string | null;
  hospitals: string[];
}

export interface Profile {
  id: string;
  role: string;
  name: string;
  phone: string | null;
  country: string | null;
  created_at: string;
  updated_at: string;
}

export interface Case {
  id: string;
  patient_id: string;
  category: string | null;
  condition: string | null;
  previous_treatment: string | null;
  city: string | null;
  country: string | null;
  status: string;
  coordinator_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface CaseTimeline {
  id: string;
  case_id: string;
  stage: string;
  note: string | null;
  created_at: string;
}

export interface Appointment {
  id: string;
  case_id: string | null;
  doctor_id: string | null;
  type: string;
  scheduled_at: string | null;
  status: string;
  link: string | null;
  dv_doctors?: { name: string; specialty: string } | null;
}

export interface Document {
  id: string;
  patient_id: string;
  case_id: string | null;
  label: string;
  url: string;
  created_at: string;
}

export interface MedicineOrder {
  id: string;
  patient_id: string;
  case_id: string | null;
  items: unknown;
  status: string;
  total: string | null;
  created_at: string;
}

export interface TravelItinerary {
  id: string;
  case_id: string;
  visa_docs: unknown;
  accommodation: string | null;
  coordinator_contact: string | null;
}

export interface Message {
  id: string;
  case_id: string;
  sender_id: string;
  content: string;
  created_at: string;
}
