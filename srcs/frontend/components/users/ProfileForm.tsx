"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { updateProfile } from "@/actions/updateProfile";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import type { BackendUser } from "@/lib/backend";

type ProfileFormProps = {
	user: Pick<BackendUser, "firstName" | "lastName" | "username">;
};

export function ProfileForm({ user }: ProfileFormProps) {
	const t = useTranslations("Users");
	const p = useTranslations("Profile");
	const c = useTranslations("Common");
	const uid = React.useId();
	const [state, formAction, pending] = React.useActionState(updateProfile, null);

	function submit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const form = new FormData(event.currentTarget);
		React.startTransition(() => formAction(form));
	}

	return (
		<form onSubmit={submit} className="flex flex-col gap-4">
			<Field>
				<Label htmlFor={`${uid}-last`}>{t("userInfo.lastName")}</Label>
				<Input id={`${uid}-last`} name="lastName" defaultValue={user.lastName} autoComplete="family-name" required />
			</Field>
			<Field>
				<Label htmlFor={`${uid}-first`}>{t("userInfo.name")}</Label>
				<Input id={`${uid}-first`} name="firstName" defaultValue={user.firstName} autoComplete="given-name" required />
			</Field>
			<Field>
				<Label htmlFor={`${uid}-username`}>{t("userInfo.userName")}</Label>
				<Input id={`${uid}-username`} name="username" defaultValue={user.username} autoComplete="username" required />
			</Field>

			<div aria-live="polite" className="text-sm">
				{state?.ok && <p className="text-muted-foreground">{p("saved")}</p>}
				{state?.error && <p role="alert" className="text-destructive">{t(`errors.${state.error}`)}</p>}
			</div>

			<Button type="submit" className="self-end" disabled={pending}>
				{c("saveChanges")}
				{pending && <Spinner />}
			</Button>
		</form>
	);
}
