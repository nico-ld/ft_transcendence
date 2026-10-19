export const legalInfo = {
  projectName: "ft_silk_space",
  school: "42 Angoulême",
  team: ["nile-dai", "amartel", "mmansier", "tseche", "jdessoli"],
  contactEmail: "team@ft_silk_space.com",
  lastUpdated: "19 October 2026",
} as const;

export const teamList = new Intl.ListFormat("en", { style: "long", type: "conjunction" }).format(
  legalInfo.team,
);
