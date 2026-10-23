"use client";

import * as React from "react";
import { updateUser } from "@/actions/updateUser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SelectJob } from "@/components/layout/SelectJob";
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
import type { ModifyUserProps } from "@/types/ModifyUserProps";
import { useTranslations } from "next-intl";

function ModifyUserForm({user, viewer, onDone}: 
	Omit<ModifyUserProps, "open" | "onOpenChange"> & {onDone: () => void})
{
	const t = useTranslations("Users");
	const c = useTranslations("Common");
	const uid = React.useId();

	const isSelf = viewer.id === user.id;
	const isAdmin = viewer.role === "admin";
	const action = updateUser.bind(null, isSelf ? "me" : user.id);
	const [state, formAction, pending] = React.useActionState(action, null);

	React.useEffect(() => {
		if (state?.ok)
			onDone();
	}, [state, onDone]);

	const initials = (user.firstName[0] + user.lastName[0]).toUpperCase();

	return (
		<form action={formAction} className="flex flex-col gap-4">
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
					<SelectJob value={user.job ?? ""} name="job" />
				</Field>
			)}

			{state?.error && <p className="text-sm text-destructive">{t(`errors.${state.error}`)}</p>}

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
