export interface Hospital {
  slug: string;
  name: string;
  city: string;
  country: string;
  image: string;
  accreditations: string[];
  specialties: string[];
  beds: string;
  about: string;
  facilities: string[];
}

export const hospitals: Hospital[] = [
  {
    slug: "apollo-chennai",
    name: "Apollo Hospitals",
    city: "Chennai",
    country: "India",
    image:
      "https://images.unsplash.com/photo-1778151270902-cb0ca572f2ee?auto=format&fit=crop&q=80&w=1200",
    accreditations: ["JCI", "NABH", "NABL"],
    specialties: ["Cardiology", "Orthopedics", "Oncology", "Transplants"],
    beds: "600+",
    about:
      "A flagship quaternary-care hospital with dedicated international patient services, advanced cardiac and transplant programs, and a long record of treating overseas patients.",
    facilities: [
      "International lounge",
      "24/7 interpreter services",
      "Visa invitation letters",
      "Airport transfers",
      "Pharmacy & diagnostics",
    ],
  },
  {
    slug: "fortis-escorts-delhi",
    name: "Fortis Escorts Heart Institute",
    city: "New Delhi",
    country: "India",
    image:
      "https://images.unsplash.com/photo-1774114433487-c7088f63403b?auto=format&fit=crop&q=80&w=1200",
    accreditations: ["JCI", "NABH"],
    specialties: ["Cardiology", "Cardiac Surgery", "Vascular Surgery"],
    beds: "310",
    about:
      "A dedicated cardiac super-specialty hospital known for complex heart surgeries, international patient coordination and rapid turnaround for second opinions.",
    facilities: [
      "Dedicated cardiac ICUs",
      "International desk",
      "Rehabilitation unit",
      "Travel desk",
      "Currency exchange",
    ],
  },
  {
    slug: "tata-memorial-mumbai",
    name: "Tata Memorial Hospital",
    city: "Mumbai",
    country: "India",
    image:
      "https://images.unsplash.com/photo-1710074213374-e68503a1b795?auto=format&fit=crop&q=80&w=1200",
    accreditations: ["NABH", "NABL"],
    specialties: ["Medical Oncology", "Radiation Oncology", "Surgical Oncology"],
    beds: "700+",
    about:
      "One of India's leading cancer centers, offering subsidized and international care pathways, clinical trials, and a strong focus on multidisciplinary tumor boards.",
    facilities: [
      "Tumor board reviews",
      "International patient cell",
      "Bone-marrow transplant unit",
      "Guest house",
      "Counseling services",
    ],
  },
  {
    slug: "nimhans-bengaluru",
    name: "NIMHANS",
    city: "Bengaluru",
    country: "India",
    image:
      "https://images.unsplash.com/photo-1720463903383-c45df62da719?auto=format&fit=crop&q=80&w=1200",
    accreditations: ["NABH"],
    specialties: ["Neurology", "Neurosurgery", "Psychiatry", "Rehabilitation"],
    beds: "800+",
    about:
      "A national institute for neurosciences and mental health, recognized for stroke care, epilepsy surgery and neuro-rehabilitation programs.",
    facilities: [
      "Neuro-ICU",
      "Rehabilitation center",
      "International patient desk",
      "Teleconsultation suites",
      "Research labs",
    ],
  },
];
