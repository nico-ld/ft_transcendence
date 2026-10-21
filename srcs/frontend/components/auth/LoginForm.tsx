"use client";

import { useActionState } from "react";
import { useRouter } from "@/i18n/navigation";
import { Login } from "@/actions/auth";
import { Button } from "../ui/button";
import { ROLE_HOME } from "@/lib/utils";
import { Spinner } from "../ui/spinner";
import { Label } from "../ui/label";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { TriangleAlert } from "lucide-react";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from "../ui/card";

function ConnectionFailed({ error }: {error: string;}) {
	return (
		<Alert variant="destructive" className="max-w-wd bg-muted/50">
			<TriangleAlert />
			<AlertTitle>Connection Failed</AlertTitle>
			<AlertDescription>{error}</AlertDescription>
		</Alert>
	);
}

export function LoginForm() {
	const router = useRouter();

	const [error, formAction, pending] = useActionState(
		async (_prev: string, formData: FormData) => {
			try {
				const result = await Login({
					email: String(formData.get("email")),
					password: String(formData.get("password"))
				});
				if (!result)
					return "Invalid email or password.";
				router.replace(ROLE_HOME[result.role]);
				return "";
			} catch {
				return "Something went wrong. Please try again.";
			}
		},
		""
	);

	return (
		<div className="w-80 h-auto flex flex-col gap-2">
		<div className="mb-4" aria-live="polite">
			{error && <ConnectionFailed error={error} />}
		</div>

		<Card className="w-full max-w-sm">
			<CardHeader>
				<CardTitle>Login to your account</CardTitle>
				<CardDescription>
					Enter your email below to login to your account
				</CardDescription>
			</CardHeader>
			<form action={formAction}>
				<CardContent className="mb-3">
						<div className="flex flex-col gap-6">
							<div className="grid gap-2">
								<Label htmlFor="email">Email</Label>
								<input
									className="w-full p-0.5 bg-gray-100 rounded-2xl dark:text-zinc-900 text-center text-base"
									name="email"
									type="email"
									placeholder="Email"
									autoComplete="email"
									required
								/>
							</div>
							<div className="grid gap-2">
								<Label htmlFor="password">Password</Label>
								<input
									className="w-full p-0.5 bg-gray-100 rounded-2xl dark:text-zinc-900 text-center text-base"
									name="password"
									type="password"
									placeholder="Password"
									autoComplete="current-password"
									required
								/>
							</div>
						</div>
				</CardContent>

				<CardFooter className="flex-col gap-2">
					<Button type="submit" className="w-full" disabled={pending}>
						{pending ? "Logging in" : "Log in"}
						{pending && <Spinner />}
					</Button>
					<Button variant="outline" className="w-full">
						Log in with 42
					</Button>
				</CardFooter>
			</form>
		</Card>
		</div>
	);
}
