export interface Doctor {
  slug: string;
  name: string;
  specialty: string;
  experience: string;
  rating: string;
  procedures: string;
  languages: string[];
  image: string;
  qualifications: string[];
  expertise: string[];
  hospitals: string[];
  availability: string;
  about: string;
}

export const doctors: Doctor[] = [
  {
    slug: "dr-ananya-sharma",
    name: "Dr. Ananya Sharma",
    specialty: "Cardiology",
    experience: "18+ years",
    rating: "4.9",
    procedures: "1,200+",
    languages: ["English", "Hindi", "Arabic"],
    image:
      "https://images.unsplash.com/photo-1758691462126-2ee47c8bf9e7?auto=format&fit=crop&q=80&w=800",
    qualifications: ["MBBS, AIIMS", "MD Cardiology, Johns Hopkins", "FACC"],
    expertise: ["Interventional Cardiology", "Heart Failure", "Preventive Cardiology"],
    hospitals: ["Apollo Chennai", "Fortis Escorts Delhi"],
    availability: "Next available: Tomorrow, 10:00 AM IST",
    about:
      "Dr. Sharma is a senior interventional cardiologist with extensive experience in complex coronary interventions and international patient care.",
  },
  {
    slug: "dr-rajiv-menon",
    name: "Dr. Rajiv Menon",
    specialty: "Orthopedics",
    experience: "22+ years",
    rating: "4.8",
    procedures: "3,400+",
    languages: ["English", "Hindi", "Tamil"],
    image:
      "https://images.unsplash.com/photo-1758691462493-120a069304e6?auto=format&fit=crop&q=80&w=800",
    qualifications: ["MBBS, CMC Vellore", "MS Orthopedics, UK"],
    expertise: ["Joint Replacement", "Sports Medicine", "Spine Surgery"],
    hospitals: ["Apollo Chennai", "Max Hospital Mumbai"],
    availability: "Next available: Today, 4:30 PM IST",
    about:
      "Dr. Menon specializes in joint replacement and sports injuries, with a focus on rapid recovery and international medical travelers.",
  },
  {
    slug: "dr-priya-kulkarni",
    name: "Dr. Priya Kulkarni",
    specialty: "Oncology",
    experience: "15+ years",
    rating: "4.9",
    procedures: "900+",
    languages: ["English", "Hindi", "Marathi"],
    image:
      "https://images.unsplash.com/photo-1631562502360-4487ceab6d8a?auto=format&fit=crop&q=80&w=800",
    qualifications: ["MBBS, BJMC", "DM Oncology, Tata Memorial"],
    expertise: ["Medical Oncology", "Breast Cancer", "Lymphoma"],
    hospitals: ["Tata Memorial Mumbai", "HCG Bengaluru"],
    availability: "Next available: Monday, 9:00 AM IST",
    about:
      "Dr. Kulkarni is a medical oncologist focused on personalized cancer care and clinical trials for hematological malignancies.",
  },
  {
    slug: "dr-vikram-iyer",
    name: "Dr. Vikram Iyer",
    specialty: "Neurology",
    experience: "20+ years",
    rating: "4.8",
    procedures: "2,100+",
    languages: ["English", "Hindi", "Kannada"],
    image:
      "https://images.unsplash.com/photo-1758691462482-2b6ccbaefa6e?auto=format&fit=crop&q=80&w=800",
    qualifications: ["MBBS, KMC Manipal", "DM Neurology, NIMHANS"],
    expertise: ["Stroke", "Epilepsy", "Movement Disorders"],
    hospitals: ["NIMHANS Bengaluru", "Apollo Bengaluru"],
    availability: "Next available: Wednesday, 2:00 PM IST",
    about:
      "Dr. Iyer is a neurologist with expertise in stroke management and neuro-rehabilitation for international patients.",
  },
];
