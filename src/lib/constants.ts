export const CATEGORY_LABELS: Record<string, string> = {
  tutoring: "Education & Classes / Tutoring",
  programming: "Education & Classes / Programming",
  languages: "Education & Classes / Languages",
  music: "Education & Classes / Music & Dance",
  sports: "Education & Classes / Sports & Fitness",
};

export const CATEGORIES = [
  { value: "tutoring", label: "Tutoring" },
  { value: "programming", label: "Programming" },
  { value: "languages", label: "Languages" },
  { value: "music", label: "Music & Dance" },
  { value: "sports", label: "Sports & Fitness" },
];

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const PRICING_TYPES = [
  { value: "hourly", label: "Hourly" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "fixed", label: "Fixed / Course" },
];

