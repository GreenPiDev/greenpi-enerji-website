const TR_MAP: Record<string, string> = {
  ç: "c", ğ: "g", ı: "i", ö: "o", ş: "s", ü: "u",
};

export function slugify(text: string): string {
  const lowered = text
    .trim()
    .toLowerCase()
    .replace(/[çğıöşü]/g, (ch) => TR_MAP[ch] ?? ch);

  return lowered
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
