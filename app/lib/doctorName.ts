export function withoutTitlePrefix(name: string | null | undefined): string {
  if (!name) return "";
  return name.replace(/^(dr\.?|doctor)\s+/i, "").trim();
}
