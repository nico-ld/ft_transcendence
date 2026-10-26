import type { BackendUser } from "@/lib/backend";
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
import { useTranslations } from "next-intl";

export function RemoveUser({ user }: {user: BackendUser}) {
	const t = useTranslations("Users");
	const c = useTranslations("Common");

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
			<AlertDialogTitle>{t("delete.label", {username: user.username})}</AlertDialogTitle>
			<AlertDialogDescription>{t("delete.description")}</AlertDialogDescription>
			</AlertDialogHeader>
			<AlertDialogFooter>
				<AlertDialogCancel variant="outline">{c("cancel")}</AlertDialogCancel>
				<AlertDialogAction variant="destructive">{c("delete")}</AlertDialogAction>
			</AlertDialogFooter>
		</AlertDialogContent>
	</AlertDialog>
	);
}

