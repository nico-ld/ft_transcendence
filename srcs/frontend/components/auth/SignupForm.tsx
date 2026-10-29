"use client";

import { Link, useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useActionState } from "react";
import { Signup } from "@/actions/auth";
import { EMAIL_PATTERN, NAME_MAX_LENGTH, ROLE_HOME } from "@/lib/utils";
import { AuthError } from "@/components/auth/AuthError";
import { FormField } from "@/components/layout/FormField";
import { useFormSubmit } from "@/actions/useFormSubmit";
import { Button, buttonVariants } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";

import type { SignupError } from "@/types/SignupErrors";
import type { FieldName } from "@/types/FormFieldProps";
import Image from "next/image";

const PASSWORD_MIN_LENGTH = 8;
const USERNAME_MIN_LENGTH = 3;
const USERNAME_MAX_LENGTH = 20;

// the backend wants ^[a-zA-Z0-9_-]{3,20}$, the user can change it later from their profile
function usernameFromEmail(email: string): string {
	let username = email.split("@")[0].replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, USERNAME_MAX_LENGTH);
	while (username.length < USERNAME_MIN_LENGTH)
		username += Math.floor(Math.random() * 10);
	return username;
}

const FT_LOGIN_URL = "/api/auth/42/login";

const ERROR_FIELD: Partial<Record<Exclude<SignupError, "">, FieldName>> = {
	emailTaken: "email",
	passwordMismatch: "confirmPassword"
};

function SignupFields() {
	const router = useRouter();
	const t = useTranslations("Signup");
	const n = useTranslations("Toast");
	const v = useTranslations("Validation");

	const [error, formAction, pending] = useActionState<SignupError, FormData>(
		async (_prev, formData) => {
			const email = String(formData.get("email"));
			const username = usernameFromEmail(email);
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
		<form className="flex flex-col gap-6" onSubmit={submit}>
			{error && <AuthError title={t("failedTitle")} message={t(`errors.${error}`)}/>}
			<section className="flex flex-col gap-5">
				<article className="flex flex-row gap-5">
						<FormField
							label={t("lastName")}
							name="lastName"
							autoComplete="lastName"
							error={fieldError("lastName")}
							maxLength={NAME_MAX_LENGTH}
							required
						/>
						<FormField
							label={t("firstName")}
							name="firstName"
							autoComplete="firstName"
							error={fieldError("firstName")}
							maxLength={NAME_MAX_LENGTH}
							required
						/>
				</article>
				<FormField
					label={t("email")}
					name="email"
					type="email"
					autoComplete="email"
					error={fieldError("email")}
					pattern={EMAIL_PATTERN}
					title={v("email")}
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
			</section>
			<section className="flex flex-col items-center">
				<Button type="submit" className="w-3/4 h-10" disabled={pending}>
					{pending ? t("signingUp") : t("signUp")}
					{pending && <Spinner />}
				</Button>
			</section>
		</form>
	);
}

export function SignupForm() {
	const t = useTranslations("Signup");

	return (
		<main className="flex flex-col gap-5">
			<section className="text-center mb-2">
				<h1 className="font-bold text-2xl">{t("title")}</h1>
			</section>
			<hr />
			<SignupFields />
			<section className="flex flex-col items-center gap-4">
				<a href={FT_LOGIN_URL} className={buttonVariants({variant: "outline", className: "w-3/4 h-10 gap-4"})}>
					<Image src="/42_logo.svg" alt="" width={50} height={50} unoptimized className="size-5 invert dark:invert-0"/>
					{t("with42")}
				</a>
			</section>
			<hr />
			<Link href="/login" className="text-xs text-center hover:underline">{t("haveAccount")}</Link>
		</main>
	);
}
