import type { BackendUser } from "@/lib/backend";
import type { Viewer } from "@/types/Viewer";

export type ModifyUserProps = {
	user: BackendUser;
	viewer: Viewer;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}
