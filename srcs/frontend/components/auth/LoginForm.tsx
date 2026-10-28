"use client";

import { Link, useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useActionState, useRef } from "react";
import Image from "next/image";

import { Login } from "@/actions/auth";
import { ROLE_HOME } from "@/lib/utils";
import { AuthError } from "./AuthError";
import { FormField } from "../layout/FormField";
import { useFormSubmit } from "@/actions/useFormSubmit";
import { Button, buttonVariants } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { toast } from "../ui/toast";

import type { LoginError } from "@/types/LoginError";

const FT_LOGIN_URL = "/api/auth/42/login";

function LoginFields({oauthError = ""}: {oauthError?: LoginError}) {
	const router = useRouter();
	const t = useTranslations("Login");
	const passwordRef = useRef<HTMLInputElement>(null);

	function resetPassword() {
		if (!passwordRef.current)
			return ;
		passwordRef.current.value = "";
		passwordRef.current.focus();
	}
	const n = useTranslations("Toast");

	const [error, formAction, pending] = useActionState<LoginError, FormData>(
		async (_prev, formData) => {
			try {
				const result = await Login({
					email: String(formData.get("email")),
					password: String(formData.get("password"))
				});
				if (!result) {
					resetPassword();
					return "invalidCredentials";
				}
				toast.add({ type: "success", title: n("loggedIn") });
				router.replace(ROLE_HOME[result.role]);
				return "";
			} catch {
				resetPassword();
				return "generic";
			}
		},
		oauthError
	);

	const submit = useFormSubmit(formAction);

	return (
		<form className="flex flex-col gap-6 min-w-sm" onSubmit={submit}>
			{error && <AuthError title={t("failedTitle")} message={t(`errors.${error}`)}/>}
			<section className="flex flex-col gap-5">
				<FormField
					label={t("email")}
					name="email"
					type="email"
					autoComplete="email"
					required
				/>
				<FormField
					ref={passwordRef}
					label={t("password")}
					name="password"
					type="password"
					required
				/>
			</section>
			<section className="flex flex-col items-center">
				<Button type="submit" className="w-3/4 h-10" disabled={pending}>
				{pending ? t("loggingIn") : t("login")}
				{pending && <Spinner />}
				</Button>
			</section>
		</form>
	);
}

// oauthError: why the 42 login failed, from ?error= (login/page.tsx)
export function LoginForm({oauthError = ""}: {oauthError?: LoginError}) {
	const t = useTranslations("Login");

	return (
		<main className="flex flex-col gap-5">
			<section className="text-center mb-2">
				<h1 className="font-bold text-2xl">{t("title")}</h1>
			</section>
			<hr />
			<LoginFields oauthError={oauthError} />
			<section className="flex flex-col items-center gap-4">
				<a href={FT_LOGIN_URL} className={buttonVariants({variant: "outline", className: "w-3/4 h-10 gap-3"})}>
					<Image src="/42_logo.svg" alt="" width={50} height={50} unoptimized className="size-5 invert dark:invert-0"/>
					{t("with42")}
				</a>
			</section>
			<hr />
			<Link href="/signup" className="text-xs text-center hover:underline">{t("noAccount")}</Link>
		</main>
	);
}
