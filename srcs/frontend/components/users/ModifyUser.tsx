"use client";

import * as React from "react";
import { updateUser } from "@/actions/updateUser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SelectJob } from "@/components/layout/SelectJob";
import { SelectRole } from "@/components/layout/SelectRole";
import {
	Avatar,
	AvatarImage,
	AvatarFallback
} from "@/components/ui/avatar";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Field } from "@/components/ui/field";
import { toast } from "@/components/ui/toast";
import type { ModifyUserProps } from "@/types/ModifyUserProps";
import type { UpdateUserState } from "@/types/User";
import { useTranslations } from "next-intl";

function ModifyUserForm({user, viewer, onDone}:
	Omit<ModifyUserProps, "open" | "onOpenChange"> & {onDone: () => void})
{
	const t = useTranslations("Users");
	const c = useTranslations("Common");
	const n = useTranslations("Toast");
	const uid = React.useId();

	const isAdmin = viewer.role === "admin";
	const isSelf = user.id === viewer.id;
	// toast here and not in the effect below: the effect runs again on every render
	const [state, formAction, pending] = React.useActionState(
		async (prev: UpdateUserState, form: FormData) => {
			const result = await updateUser(user.id, prev, form);
			if (result?.ok)
				toast.add({ type: "success", title: n("userUpdated") });
			return result;
		},
		null
	);

	React.useEffect(() => {
		if (state?.ok)
			onDone();
	}, [state, onDone]);

	// Using onSubmit, not <form action>, because React empties the fields
	// after a form action (as in NewUserForm)
	function submit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const form = new FormData(event.currentTarget);
		React.startTransition(() => formAction(form));
	}

	const initials = `${user.firstName[0] ?? ""}${user.lastName[0] ?? ""}`.toUpperCase() || user.username.slice(0, 2).toUpperCase();

	return (
		<form onSubmit={submit} className="flex flex-col gap-4">
			<SheetHeader>
				<SheetTitle>
					<div className="flex flex-row gap-4 items-center">
						<Avatar>
							<AvatarImage src={user.avatar ?? undefined} />
							<AvatarFallback>{initials}</AvatarFallback>
						</Avatar>
						<span className="font-bold">{user.lastName} {user.firstName}</span>
					</div>
				</SheetTitle>
				<SheetDescription>{t("editProfil", {username: user.username})}</SheetDescription>
			</SheetHeader>

			<div className="flex flex-col gap-4 px-4">
				<Field>
					<Label htmlFor={`${uid}-last`}>{t("userInfo.lastName")}</Label>
					<Input id={`${uid}-last`} name="lastName" defaultValue={user.lastName} required />
				</Field>
				<Field>
					<Label htmlFor={`${uid}-first`}>{t("userInfo.name")}</Label>
					<Input id={`${uid}-first`} name="firstName" defaultValue={user.firstName} required />
				</Field>
				<Field>
					<Label htmlFor={`${uid}-username`}>{t("userInfo.userName")}</Label>
					<Input id={`${uid}-username`} name="username" defaultValue={user.username} required />
				</Field>
				{isAdmin && (
					<Field>
						<Label htmlFor={`${uid}-job`}>{t("userInfo.job")}</Label>
						<SelectJob value={user.job} name="job" />
						<p className="text-xs text-muted-foreground">{t("jobHint")}</p>
					</Field>
				)}
				{isAdmin && (
					<Field>
						<Label htmlFor={`${uid}-role`}>{t("userInfo.role")}</Label>
						<SelectRole id={`${uid}-role`} name="role" value={user.role} disabled={isSelf} />
						{isSelf && <p className="text-xs text-muted-foreground">{t("roleHint")}</p>}
					</Field>
				)}

				{state?.error && <p role="alert" className="text-sm text-destructive">{t(`errors.${state.error}`)}</p>}
			</div>

			<SheetFooter>
				<Button type="submit" disabled={pending}>{c("saveChanges")}</Button>
				<SheetClose render={<Button type="button" variant="outline">{c("close")}</Button>} />
			</SheetFooter>
		</form>
	);
}

export function ModifyUser({user, viewer, open, onOpenChange}: ModifyUserProps) {
	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent>
				<ModifyUserForm key={user.id} user={user} viewer={viewer} onDone={() => onOpenChange(false)} />
			</SheetContent>
		</Sheet>
	);
}
