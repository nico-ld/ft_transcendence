// The facts both legal pages rely on, in one place.
// Before the evaluation: set contactEmail to an address the team actually reads.

export const legalInfo = {
  projectName: "ft_silk_space",
  school: "42 Angoulême",
  team: ["nile-dai", "amartel", "mmansier", "tseche", "jdessoli"],
  contactEmail: "REPLACE-WITH-TEAM-EMAIL@example.com",
  lastUpdated: "17 October 2026",
} as const;

export const teamList = new Intl.ListFormat("en", { style: "long", type: "conjunction" }).format(
  legalInfo.team,
);
