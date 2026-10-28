"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { changePassword } from "@/actions/changePassword";
import { useFormSubmit } from "@/actions/useFormSubmit";
import { FormField } from "@/components/layout/FormField";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import type { PasswordError } from "@/types/User";

type PasswordField = "currentPassword" | "newPassword" | "confirmPassword";

// the field each error is shown under; the others go below the form
const ERROR_FIELD: Partial<Record<PasswordError, PasswordField>> = {
	wrongCurrent: "currentPassword",
	same: "newPassword",
	invalid: "newPassword",
	mismatch: "confirmPassword"
};

export function PasswordForm() {
	const t = useTranslations("Profile.password");
	const formRef = React.useRef<HTMLFormElement>(null);
	const [state, formAction, pending] = React.useActionState(changePassword, null);
	const submit = useFormSubmit(formAction);
	const errorField = state?.error ? ERROR_FIELD[state.error] : undefined;

	// emptied once changed; on an error, the field it concerns gets the focus
	React.useEffect(() => {
		if (state?.ok)
			formRef.current?.reset();
		if (errorField)
			(formRef.current?.elements.namedItem(errorField) as HTMLInputElement | null)?.focus();
	}, [state, errorField]);

	const fieldError = (name: PasswordField) =>
		state?.error && errorField === name ? t(`errors.${state.error}`) : undefined;

	return (
		<form ref={formRef} onSubmit={submit} className="flex flex-col gap-4">
			<FormField
				label={t("current")}
				name="currentPassword"
				type="password"
				autoComplete="current-password"
				maxLength={128}
				error={fieldError("currentPassword")}
				required
			/>
			<FormField
				label={t("new")}
				name="newPassword"
				type="password"
				autoComplete="new-password"
				minLength={8}
				maxLength={128}
				error={fieldError("newPassword")}
				required
			/>
			<FormField
				label={t("confirm")}
				name="confirmPassword"
				type="password"
				autoComplete="new-password"
				error={fieldError("confirmPassword")}
				required
			/>

			<div aria-live="polite" className="text-sm">
				{state?.ok && <p className="text-muted-foreground">{t("saved")}</p>}
				{state?.error && !errorField && <p role="alert" className="text-destructive">{t(`errors.${state.error}`)}</p>}
			</div>

			<Button type="submit" className="self-end" disabled={pending}>
				{t("submit")}
				{pending && <Spinner />}
			</Button>
		</form>
	);
}
