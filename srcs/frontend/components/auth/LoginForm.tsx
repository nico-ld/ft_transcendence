"use client";

import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import type { LoginError } from "@/types/LoginError";
import { useActionState } from "react";
import { Login } from "@/actions/auth";
import { Button, buttonVariants } from "../ui/button";
import { ROLE_HOME } from "@/lib/utils";
import { Spinner } from "../ui/spinner";
import { Label } from "../ui/label";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { TriangleAlert } from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from "../ui/card";

// handled by the backend (routers/oauth42.py)
const FT_LOGIN_URL = "/api/auth/42/login";

function ConnectionFailed({ error }: {error: Exclude<LoginError, "">}) {
	const t = useTranslations("Login");

	return (
		<Alert variant="destructive" className="max-w-wd bg-muted/50">
			<TriangleAlert />
			<AlertTitle>{t("failedTitle")}</AlertTitle>
			<AlertDescription>{t(`errors.${error}`)}</AlertDescription>
		</Alert>
	);
}

export function LoginForm({ oauthError = "" }: { oauthError?: LoginError }) {
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

	return (
		<div className="w-80 h-auto flex flex-col gap-2">
		<div className="mb-4" aria-live="polite">
			{error && <ConnectionFailed error={error} />}
		</div>

		<Card className="w-full max-w-sm">
			<CardHeader>
				<CardTitle>{t("title")}</CardTitle>
				<CardDescription>{t("description")}</CardDescription>
			</CardHeader>
			<form action={formAction}>
				<CardContent className="mb-3">
						<div className="flex flex-col gap-6">
							<div className="grid gap-2">
								<Label htmlFor="email">{t("email")}</Label>
								<input
									className="w-full p-0.5 bg-gray-100 rounded-2xl dark:text-zinc-900 text-center text-base"
									name="email"
									type="email"
									placeholder={t("email")}
									autoComplete="email"
									required
								/>
							</div>
							<div className="grid gap-2">
								<Label htmlFor="password">{t("password")}</Label>
								<input
									className="w-full p-0.5 bg-gray-100 rounded-2xl dark:text-zinc-900 text-center text-base"
									name="password"
									type="password"
									placeholder={t("password")}
									autoComplete="current-password"
									required
								/>
							</div>
						</div>
				</CardContent>

				<CardFooter className="flex-col gap-2">
					<Button type="submit" className="w-full" disabled={pending}>
						{pending ? t("loggingIn") : t("login")}
						{pending && <Spinner />}
					</Button>
					{/* plain <a>, not Link: a full page load, without a locale prefix */}
					<a href={FT_LOGIN_URL} className={buttonVariants({ variant: "outline", className: "w-full" })}>
						{t("with42")}
					</a>
				</CardFooter>
			</form>
		</Card>
		</div>
	);
}
