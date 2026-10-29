import { Role } from "@/types/User";
import type { BackendUser } from "./backend";
import type { SystemStats } from "./stats";

export const mockAdmin: BackendUser = {
	id: 2, email: "admin@email.com", username: "Le Roux",
	firstName: "Ada", lastName: "Admin", avatar: null, job: "sofware-engineer",
	role: Role.ADMIN, createdAt: "2026-01-01T00:00:00.000Z",
	hasPassword: true, isGuest: true
};

export const mockUsers: BackendUser[] = [
	mockAdmin,
	{
		...mockAdmin, id: 2, email: "user@email.com", 
		username: "nile-dai", role: Role.USER
	}
];

export const mockStats: SystemStats = {
	memory: {usedGb: 0, totalGb: 0, path: "bug/path"},
	logTime: {week: "0h00", month: "0h00"},
	daily: [0, 0, 0, 0, 0, 0, 0]
};
