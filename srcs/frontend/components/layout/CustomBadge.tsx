import { Badge } from "../ui/badge";
import { Sword } from "lucide-react";

export function AdminBadge() {
	return (
		<Badge className="bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
			<Sword />
			Admin
		</Badge>
	);
}

export function UserBadge( {job}: {job: string;}) {
	return (
		<Badge className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
			{job}
		</Badge>
	);
}
