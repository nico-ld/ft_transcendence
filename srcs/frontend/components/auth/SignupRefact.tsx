"use client";

import { Link, useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useActionState, useTransition } from "react";
import { Login, Signup } from "@/actions/auth";
import { ROLE_HOME } from "@/lib/utils";
import { AuthCard } from "./AuthCard";
import { AuthError } from "./AuthError";
import { FormField } from "../layout/FormField";
import { useFormSubmit } from "@/actions/useFormSubmit";

import type { SignupError } from "@/types/SignupErrors";
import type { FieldName } from "@/types/FormFieldProps";
import { cp } from "fs";

const PASSWORD_MIN_LENGTH = 8;
const USERNAME_PATTERN = "[a-zA-Z0-9_]{3,20}";

const ERROR_FIELD: Partial<Record<Exclude<SignupError, "">, FieldName>> = {
	emailTaken: "email",
	usernameTaken: "username",
	weakPassword: "password",
	passwordMismatch: "confirmPassword"
};

export function SignupForm() {
	const router = useRouter();
	const t = useTranslations("Signup");

	const [error, formAction, pending] = useActionState<SignupError, FormData>(
		async (_prev, formData) => {
			const email = String(formData.get("email"));
			const username = String(formData.get("username"));
			const password = String(formData.get("password"));

			if (password !== String(formData.get("confirmPassword")))
				return "passwordMismatch";

			try {
				const signupError = await Signup({email, username, password});
				if (signupError)
					return signupError;

				const result = await Login({email, password});
				if (!result)
					return "generic";
				router.replace(ROLE_HOME[result.role]);
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
			<div className="w-full flex flex-row gap-5">
				<FormField
					label={t("lastName")}
					name="lastName"
					autoComplete="lastName"
					error={fieldError("lastName")}
					required
				/>
				<FormField
					label={t("firstName")}
					name="firstName"
					autoComplete="firstName"
					error={fieldError("firstName")}
					required
				/>
			</div>

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
