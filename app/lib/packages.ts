export interface Package {
  slug: string;
  name: string;
  country: string;
  price: string;
  stay: string;
  specialty: string;
  includes: string[];
  description: string;
  hospitals: string[];
}

export const packages: Package[] = [
  {
    slug: "knee-replacement",
    name: "Knee Replacement",
    specialty: "Orthopedics",
    country: "India",
    price: "$4,800",
    stay: "10–14 days",
    description:
      "A comprehensive joint replacement package including pre-operative evaluation, surgery, hospital stay, physiotherapy and follow-up. Ideal for patients seeking high-quality orthopedic care with clear bundled pricing.",
    hospitals: ["Apollo Chennai", "Max Hospital Mumbai"],
    includes: [
      "Specialist consultation",
      "Surgery",
      "Hospital stay",
      "Follow-up",
      "Care coordination",
      "Airport pickup assistance",
    ],
  },
  {
    slug: "cardiac-bypass",
    name: "Cardiac Bypass",
    specialty: "Cardiology",
    country: "India",
    price: "$7,200",
    stay: "12–16 days",
    description:
      "Cardiac bypass surgery package managed by a senior cardiologist and cardiac surgeon team. Includes intensive care, rehabilitation planning and dedicated cardiac nursing.",
    hospitals: ["Fortis Escorts Delhi", "Apollo Chennai"],
    includes: [
      "Cardiologist consultation",
      "Procedure",
      "Intensive care",
      "Rehabilitation plan",
      "Travel support",
      "Diet and recovery guide",
    ],
  },
  {
    slug: "liver-transplant",
    name: "Liver Transplant",
    specialty: "Transplants",
    country: "India",
    price: "On request",
    stay: "30–45 days",
    description:
      "End-to-end transplant evaluation and coordination package. Pricing is shared after medical review because donor matching and case complexity vary significantly.",
    hospitals: ["Apollo Chennai", "Tata Memorial Mumbai"],
    includes: [
      "Transplant evaluation",
      "Surgery & post-op care",
      "Donor coordination",
      "Accommodation support",
      "Long-term follow-up",
      "Interpreter services",
    ],
  },
  {
    slug: "spine-surgery",
    name: "Spine Surgery",
    specialty: "Neurology",
    country: "India",
    price: "$5,500",
    stay: "8–12 days",
    description:
      "Spine surgery and neuro-rehabilitation package for conditions such as herniated discs, spinal stenosis and deformities. Includes physiotherapy and discharge planning.",
    hospitals: ["NIMHANS Bengaluru", "Apollo Chennai"],
    includes: [
      "Neuro/spine consultation",
      "Procedure",
      "Physiotherapy",
      "Hospital stay",
      "Discharge planning",
      "Tele-rehab follow-up",
    ],
  },
  {
    slug: "ivf-fertility",
    name: "IVF & Fertility",
    specialty: "Women's Health",
    country: "India",
    price: "$3,200",
    stay: "7–10 days",
    description:
      "A fertility treatment package including one IVF cycle with monitoring, medication support and counseling. Designed for international couples seeking discreet, coordinated care.",
    hospitals: ["Apollo Chennai", "Fortis Delhi"],
    includes: [
      "Fertility consultation",
      "IVF cycle",
      "Medication support",
      "Ultrasound monitoring",
      "Travel coordination",
      "Counseling session",
    ],
  },
  {
    slug: "dental-implants",
    name: "Dental Implants",
    specialty: "Dental",
    country: "India",
    price: "$1,200",
    stay: "5–7 days",
    description:
      "Dental implant package covering assessment, implant placement and crown fitting. Suitable for patients looking for quality dental restoration with short travel stays.",
    hospitals: ["Apollo Chennai"],
    includes: [
      "Dental assessment",
      "Implant placement",
      "Crown fitting",
      "Follow-up",
      "Local transport",
      "Digital scan and X-ray",
    ],
  },
];
