"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { updateProfile } from "@/actions/updateProfile";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import type { BackendUser } from "@/lib/backend";
import type { UpdateUserState } from "@/types/User";

type ProfileFormProps = {
	user: Pick<BackendUser, "firstName" | "lastName" | "username">;
};

export function ProfileForm({ user }: ProfileFormProps) {
	const t = useTranslations("Users");
	const p = useTranslations("Profile");
	const c = useTranslations("Common");
	const uid = React.useId();
	const [state, formAction, pending] = React.useActionState(
		async (prev: UpdateUserState, form: FormData) => {
			const result = await updateProfile(prev, form);
			if (result?.ok)
				toast.add({ type: "success", title: p("saved") });
			return result;
		},
		null
	);

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

			{state?.error && <p role="alert" className="text-sm text-destructive">{t(`errors.${state.error}`)}</p>}

			<Button type="submit" className="self-end" disabled={pending}>
				{c("saveChanges")}
				{pending && <Spinner />}
			</Button>
		</form>
	);
}
