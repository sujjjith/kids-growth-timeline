export const KIDS = {
  nirek: { id: "nirek", firstName: "Nirek", gender: "Male", dob: "2020-07-09" },
  mishka: { id: "mishka", firstName: "Mishka", gender: "Female", dob: "2017-04-09" },
} as const;

export type CategoryKey = "Education" | "Activity" | "Competition" | "Camp" | "Trip" | "Growth";

export const CATEGORY_COLORS: Record<string, string> = {
  Education: "#4A7FB5",
  Activity: "#5B9A6F",
  Competition: "#D4793A",
  Camp: "#C4A43E",
  Trip: "#8B6BAE",
  Growth: "#D4697A",
};

export const CATEGORY_LABELS: Record<string, string> = {
  Education: "Education",
  Activity: "Activities",
  Competition: "Competitions",
  Camp: "Summer Camps",
  Trip: "Vacation Trips",
  Growth: "Growth",
};

export function getCategoryColor(category: string): string {
  return CATEGORY_COLORS[category] ?? "#6B5B4F";
}

export function formatDate(dateValue: string | undefined | null): string {
  if (!dateValue) return "";
  try {
    const d = new Date(dateValue);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateValue;
  }
}

export function calculateAge(dob: string): { years: number; months: number } {
  const birthDate = new Date(dob);
  const today = new Date();
  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();
  if (months < 0) {
    years--;
    months += 12;
  }
  if (today.getDate() < birthDate.getDate()) {
    months--;
    if (months < 0) {
      years--;
      months += 12;
    }
  }
  return { years, months };
}

export function generateId(): string {
  return crypto.randomUUID();
}
