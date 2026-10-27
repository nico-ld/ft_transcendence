import { Button, buttonVariants } from "../ui/button";
import { Spinner } from "../ui/spinner";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from "../ui/card";

import type { AuthProps } from "@/types/AuthProps";

const FT_LOGIN_URL = "/api/auth/42/login";

export function AuthCard({
	title,
	description,
	alert,
	onSubmit,
	pending,
	submitLabel,
	pendingLabel,
	with42Label,
	switchLink,
	children
}: AuthProps) {
	return (
		<div className="w-80 h-auto flex flex-col gap-2">
			<div className="mb-4" aria-live="polite">
				{alert}
			</div>
		
			<Card className="w-full max-w-sm">
				<CardHeader>
					<CardTitle>{title}</CardTitle>
					<CardDescription>{description}</CardDescription>
				</CardHeader>
				<form onSubmit={onSubmit}>
					<CardContent className="mb-3">
						<div className="flex flex-col gap-6">{children}</div>
					</CardContent>

					<CardFooter className="flex-col gap-2">
						<Button type="submit" className="w-full" disabled={pending}>
							{pending ? pendingLabel : submitLabel}
							{pending && <Spinner />}
						</Button>
						<a href={FT_LOGIN_URL} className={buttonVariants({variant: "outline", className: "w-full"})}>
							{with42Label}
						</a>
						{switchLink}
					</CardFooter>
				</form>
			</Card>
		</div>
	);
}
