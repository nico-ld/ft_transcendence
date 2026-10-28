"use client";

import { Link, useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useActionState } from "react";
import { Signup } from "@/actions/auth";
import { ROLE_HOME } from "@/lib/utils";
import { AuthError } from "./AuthError";
import { FormField } from "../layout/FormField";
import { useFormSubmit } from "@/actions/useFormSubmit";

import type { SignupError } from "@/types/SignupErrors";
import type { FieldName } from "@/types/FormFieldProps";

const PASSWORD_MIN_LENGTH = 8;

const ERROR_FIELD: Partial<Record<Exclude<SignupError, "">, FieldName>> = {
	emailTaken: "email",
	passwordMismatch: "confirmPassword"
};

function SignFields() {
	const router = useRouter();
	const t = useTranslations("Signup");

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
		<section className="flex flex-row gap-5">
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
		</section>
	);
}

export function SignupForm() {

}
