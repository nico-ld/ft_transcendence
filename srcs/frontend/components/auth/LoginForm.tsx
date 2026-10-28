"use client";

import { Link, useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useActionState } from "react";
import Image from "next/image";

import { Login } from "@/actions/auth";
import { ROLE_HOME } from "@/lib/utils";
import { AuthCard } from "./AuthCard";
import { AuthError } from "./AuthError";
import { FormField } from "../layout/FormField";
import { useFormSubmit } from "@/actions/useFormSubmit";
import { Button, buttonVariants } from "../ui/button";
import { Spinner } from "../ui/spinner";

import type { LoginError } from "@/types/LoginError";

const FT_LOGIN_URL = "/api/auth/42/login";

function LoginFields({oauthError = ""}: {oauthError?: LoginError}) {
	const router = useRouter();
	const t = useTranslations("Login");

	const [error, formAction, pending] = useActionState<LoginError, FormData>(
		async (_prev, formData) => {
			try {
				const result = await Login({
					email: String(formData.get("email")),
					password: String(formData.get("password"))
				});
				if (!result)
					return "invalidCredentials";
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
		<form className="flex flex-col gap-6" onSubmit={submit}>
			<section className="flex flex-col gap-5">
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

export function LoginForm() {
	const t = useTranslations("Login");

	return (
		<main className="flex flex-col gap-5">
			<section className="text-center mb-2">
				<h1 className="font-bold text-2xl">{t("title")}</h1>
			</section>
			<hr />
			<LoginFields />
			<section className="flex flex-col items-center gap-4">
				<Link href={FT_LOGIN_URL} className={buttonVariants({variant: "outline", className: "w-3/4 h-10 gap-3 font-semibold"})}>
					{t("with42")}
					<Image src="/42_logo.svg" alt="42" width={50} height={50} unoptimized className="size-5 text-primary invert dark:invert-0"/>
				</Link>
			</section>
			<hr />
			<Link href="/signup" className="text-xs hover:underline">{t("noAccount")}</Link>
		</main>
	);
}
