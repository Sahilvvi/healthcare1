export const ROLES = {
  PATIENT: "patient",
  DOCTOR: "doctor",
  ADMIN: "admin",
  SUPERADMIN: "superadmin",
} as const;

export function isPatient(role: string | null | undefined) {
  return role === ROLES.PATIENT;
}

export function isDoctor(role: string | null | undefined) {
  return role === ROLES.DOCTOR || role === ROLES.ADMIN || role === ROLES.SUPERADMIN;
}

export function isAdmin(role: string | null | undefined) {
  return role === ROLES.ADMIN || role === ROLES.SUPERADMIN;
}

export function isSuperAdmin(role: string | null | undefined) {
  return role === ROLES.SUPERADMIN;
}

export function roleDashboard(role: string | null | undefined) {
  if (isAdmin(role)) return "/admin/dashboard";
  if (isDoctor(role)) return "/doctor/dashboard";
  return "/patient/dashboard";
}
