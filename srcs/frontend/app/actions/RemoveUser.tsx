import type { User } from "@/types/User";
import { Button } from "@/components/ui/button";
import { UserRoundX } from "lucide-react";
import { 
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogMedia,
	AlertDialogTitle,
	AlertDialogTrigger
} from "@/components/ui/alert-dialog"

export function RemoveUser({ user }: {user: User}) {
	return (
		<AlertDialog>
			<AlertDialogTrigger
				render={<Button variant="ghost" size="icon" className="rounded-full text-red-500"><UserRoundX /></Button>}
			/>
			<AlertDialogContent size="sm">
			<AlertDialogHeader>
			<AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
				<UserRoundX />
			</AlertDialogMedia>
			<AlertDialogTitle>Delete {user.username} profil</AlertDialogTitle>
			<AlertDialogDescription>
				This will permanently delete this user and his data. 
				Be sure you save every sensitives data.
			</AlertDialogDescription>
			</AlertDialogHeader>
			<AlertDialogFooter>
				<AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
				<AlertDialogAction variant="destructive">Delete</AlertDialogAction>
			</AlertDialogFooter>
		</AlertDialogContent>
	</AlertDialog>
	);
}

