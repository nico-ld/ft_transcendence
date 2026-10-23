import type { User } from "@/types/User"

export type ModifyUserProps = {
	user: User;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}
