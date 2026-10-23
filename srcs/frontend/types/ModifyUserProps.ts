import type { User } from "@/types/User"
import type { BackendUser } from "@/lib/backend";

export type ModifyUserProps = {
	user: BackendUser;
	viewer: Pick<BackendUser, "id" | "role">;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}
