"use client";

import * as React from "react";
import type { BackendUser } from "@/lib/backend";
import type { UserError } from "@/types/User";
import { deleteUser } from "@/actions/deleteUser";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
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
	const n = useTranslations("Toast");
	const [open, setOpen] = React.useState(false);
	const [error, setError] = React.useState<UserError>();
	const [pending, startTransition] = React.useTransition();

	// stays open while deleting, and on a failure to show why
	function handleOpenChange(next: boolean) {
		if (pending)
			return ;
		setOpen(next);
		setError(undefined);
	}

	function remove() {
		startTransition(async () => {
			const result = await deleteUser(user.id);
			if (!result.ok) {
				setError(result.error);
				return ;
			}
			setOpen(false);
			toast.add({ type: "success", title: n("userDeleted") });
		});
	}

	return (
		<AlertDialog open={open} onOpenChange={handleOpenChange}>
			<AlertDialogTrigger
				render={
					<Button
						variant="ghost"
						size="icon"
						className="rounded-full text-red-500"
						aria-label={t("delete.trigger", {username: user.username})}
					>
						<UserRoundX />
					</Button>
				}
			/>
			<AlertDialogContent size="sm">
				<AlertDialogHeader>
					<AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
						<UserRoundX />
					</AlertDialogMedia>
					<AlertDialogTitle>{t("delete.label", {username: user.username})}</AlertDialogTitle>
					<AlertDialogDescription>{t("delete.description")}</AlertDialogDescription>
				</AlertDialogHeader>
				{error && <p role="alert" className="text-sm text-destructive">{t(`errors.${error}`)}</p>}
				<AlertDialogFooter>
					<AlertDialogCancel variant="outline" disabled={pending}>{c("cancel")}</AlertDialogCancel>
					<AlertDialogAction variant="destructive" disabled={pending} onClick={remove}>
						{c("delete")}
						{pending && <Spinner />}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
