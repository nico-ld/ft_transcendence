"use client";

import { Link, useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useActionState } from "react";

import { Login } from "@/actions/auth";
import { ROLE_HOME } from "@/lib/utils";
import { AuthCard } from "./AuthCard";
import { AuthError } from "./AuthError";
import { FormField } from "../layout/FormField";
import { useFormSubmit } from "@/actions/useFormSubmit";
import { toast } from "../ui/toast";

import type { LoginError } from "@/types/LoginError";

export function LoginForm({oauthError = ""}: {oauthError?: LoginError}) {
	const router = useRouter();
	const t = useTranslations("Login");
	const n = useTranslations("Toast");

	const [error, formAction, pending] = useActionState<LoginError, FormData>(
		async (_prev, formData) => {
			try {
				const result = await Login({
					email: String(formData.get("email")),
					password: String(formData.get("password"))
				});
				if (!result)
					return "invalidCredentials";
				toast.add({ type: "success", title: n("loggedIn") });
				router.replace(ROLE_HOME[result.role]);
				return "";
			} catch {
				return "generic";
			}
		},
		oauthError
	);

	const submit = useFormSubmit(formAction);

	return (
		<AuthCard
			title={t("title")}
			description={t("description")}
			alert={error ? <AuthError title={t("failedTitle")} message={t(`errors.${error}`)} /> : null}
			onSubmit={submit}
			pending={pending}
			submitLabel={t("login")}
			pendingLabel={t("loggingIn")}
			with42Label={t("with42")}
			switchLink={
				<Link href="/signup" className="text-sm text-muted-foreground hover:underline">
					{t("noAccount")}
				</Link>
			}
		>
			<FormField
				label={t("email")}
				name="email"
				type="email"
				autoComplete="email"
				required
			/>
			<FormField
				label={t("password")}
				name="password"
				type="password"
				autoComplete="current-password"
				required
			/>
		</AuthCard>
	);
}
