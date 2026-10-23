export const JOBS = [
	"accountant",
	"data-analyst",
	"devops-engineer",
	"software-engineer",
	"technical-writer"
] as const;

export type Job = (typeof JOBS)[number];
