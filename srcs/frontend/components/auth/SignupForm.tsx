"use client";

import { Link, useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useActionState } from "react";
import { Signup } from "@/actions/auth";
import { ROLE_HOME } from "@/lib/utils";
import { AuthCard } from "./AuthCard";
import { AuthError } from "./AuthError";
import { FormField } from "../layout/FormField";
import { useFormSubmit } from "@/actions/useFormSubmit";
import { toast } from "../ui/toast";

import type { SignupError } from "@/types/SignupErrors";
import type { FieldName } from "@/types/FormFieldProps";

const PASSWORD_MIN_LENGTH = 8;
const USERNAME_PATTERN = "[a-zA-Z0-9_]{3,20}";

const ERROR_FIELD: Partial<Record<Exclude<SignupError, "">, FieldName>> = {
	emailTaken: "email",
	passwordMismatch: "confirmPassword"
};

export function SignupForm() {
	const router = useRouter();
	const t = useTranslations("Signup");
	const n = useTranslations("Toast");

	const [error, formAction, pending] = useActionState<SignupError, FormData>(
		async (_prev, formData) => {
			const email = String(formData.get("email"));
			const username = String(formData.get("username"));
			const password = String(formData.get("password"));
			const firstName = String(formData.get("firstName"));
			const lastName = String(formData.get("lastName"));

			if (password !== String(formData.get("confirmPassword")))
				return "passwordMismatch";

			try {
				const signupError = await Signup({email, username, password, firstName, lastName});
				if (signupError)
					return signupError;

				toast.add({ type: "success", title: n("accountCreated") });
				router.replace(ROLE_HOME.user);
				return "";
			} catch {
				return "generic";
			}
		}, ""
	);

	const submit = useFormSubmit(formAction);
	const errorField = error ? ERROR_FIELD[error] : undefined;
	const fieldError = (name: FieldName) => errorField === name && error ? t(`errors.${error}`) : undefined;

	return (
		<AuthCard
			title={t("title")}
			description={t("description")}
			alert={error && !errorField ? <AuthError title={t("failedTitle")} message={t(`errors.${error}`)} /> : null}
			onSubmit={submit}
			pending={pending}
			submitLabel={t("signUp")}
			pendingLabel={t("signingUp")}
			with42Label={t("with42")}
			switchLink={
				<Link href="/login" className="text-sm text-muted-foreground hover:underline">
					{t("haveAccount")}
				</Link>
			}
		>
			<FormField
				label={t("lastName")}
				name="lastName"
				autoComplete="family-name"
				error={fieldError("lastName")}
				required
			/>
			<FormField
				label={t("firstName")}
				name="firstName"
				autoComplete="given-name"
				error={fieldError("firstName")}
				required
			/>
			<FormField
				label={t("username")}
				name="username"
				autoComplete="username"
				pattern={USERNAME_PATTERN}
				title={t("usernameHint")}
				error={fieldError("username")}
				required
			/>
			<FormField
				label={t("email")}
				name="email"
				type="email"
				autoComplete="email"
				error={fieldError("email")}
				required
			/>
			<FormField
				label={t("password")}
				name="password"
				type="password"
				autoComplete="new-password"
				minLength={PASSWORD_MIN_LENGTH}
				error={fieldError("password")}
				required
			/>
			<FormField
				label={t("confirmPassword")}
				name="confirmPassword"
				type="password"
				autoComplete="new-password"
				error={fieldError("confirmPassword")}
				required
			/>
		</AuthCard>
	);
}
