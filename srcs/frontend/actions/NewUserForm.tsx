"use client";

import { startTransition, useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserRoundPlus } from "lucide-react";
import { SelectJob } from "@/components/layout/SelectJob";
import { CreateUser, type ActionResult } from "./users";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
import { Spinner } from "@/components/ui/spinner";

const NOTHING_YET: ActionResult = { error: "", done: false };

export function NewUserForm() {
	const t = useTranslations("Users");
	const c = useTranslations("Common");
	const l = useTranslations("Login");

	const router = useRouter();
	// controlled, so the dialog can close itself once the user is created
	const [open, setOpen] = useState(false);
	const [state, formAction, pending] = useActionState(
		async (previous: ActionResult, form: FormData) => {
			const result = await CreateUser(previous, form);
			if (result.done) {
				setOpen(false);
				// reload the page's server data (the user list, from backend)
				router.refresh();
			}
			return result;
		},
		NOTHING_YET,
	);

	// Submitted by hand rather than with <form action>: React empties the fields after
	// every form action, so the admin would have to retype everything.
	function submit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const form = new FormData(event.currentTarget);
		startTransition(() => formAction(form));
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger render={<Button variant="ghost" className="text-green-500"><UserRoundPlus /></Button>} />
			<DialogContent className="sm:max-w-sm">
				{/* the <form> is inside the dialog: the dialog is rendered elsewhere in the
				    page (a portal), so a <form> around it wouldn't contain the fields */}
				<form onSubmit={submit} className="grid gap-4">
					<DialogHeader>
						<DialogTitle>{t("create.label")}</DialogTitle>
						<DialogDescription>{t("create.description")}</DialogDescription>
					</DialogHeader>

					<FieldGroup>
						<Field>
							<Label htmlFor="lastname-1">{t("userInfo.lastName")}</Label>
							<Input id="lastname-1" name="lastname" placeholder={t("create.phLastName")} required/>
						</Field>
						<Field>
							<Label htmlFor="name-1">{t("userInfo.name")}</Label>
							<Input id="name-1" name="name" placeholder={t("create.phName")} required/>
						</Field>
						<Field>
							<Label htmlFor="username-1">{t("userInfo.userName")}</Label>
							<Input id="username-1" name="username" placeholder={t("create.phUserName")} required/>
						</Field>
						<Field>
							<Label htmlFor="email-1">{l("email")}</Label>
							<Input id="email-1" name="email" type="email" placeholder={t("create.phEmail")} required/>
						</Field>
						<Field>
							<Label htmlFor="password-1">{l("password")}</Label>
							<Input id="password-1" name="password" type="password" placeholder={t("create.phPassword")} minLength={8} maxLength={128} required/>
						</Field>
						<Field>
							<Label htmlFor="job-1">{t("userInfo.job")}</Label>
							<SelectJob name="job" />
						</Field>
					</FieldGroup>
					{/* why the backend refused (email already used, ...) */}
					{state.error && (
						<p role="alert" className="text-sm text-destructive">{state.error}</p>
					)}
					<DialogFooter>
						<DialogClose render={<Button variant="outline">{c("cancel")}</Button>} />
						<Button type="submit" disabled={pending}>
							{pending ? "Creating..." : c("create")}
							{pending && <Spinner />}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
