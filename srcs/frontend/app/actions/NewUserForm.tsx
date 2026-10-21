"use client";

import { startTransition, useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserRoundPlus } from "lucide-react";
import { SelectJob } from "@/components/layout/SelectJob";
import { CreateUser, type ActionResult } from "@/app/actions/users";
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

const NOTHING_YET: ActionResult = { error: "", done: false };

export function NewUserForm() {
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
						<DialogTitle>Create a Profil</DialogTitle>
						<DialogDescription>
							Enter information about the new user,
							a new session will be create.
						</DialogDescription>
					</DialogHeader>

					<FieldGroup>
						<Field>
							<Label htmlFor="lastname-1">LastName</Label>
							<Input id="lastname-1" name="lastname" placeholder="Enter the LastName" required/>
						</Field>
						<Field>
							<Label htmlFor="name-1">Name</Label>
							<Input id="name-1" name="name" placeholder="Enter the name" required/>
						</Field>
						<Field>
							<Label htmlFor="name-1">Username</Label>
							<Input id="username-1" name="username" placeholder="Enter an username" required/>
						</Field>
						<Field>
							<Label htmlFor="email-1">Email</Label>
							<Input id="email-1" name="email" type="email" placeholder="Enter the email" required/>
						</Field>
						<Field>
							<Label htmlFor="password-1">Password</Label>
							{/* minLength: same rule as the backend (8 to 128 characters) */}
							<Input id="password-1" name="password" type="password" placeholder="Create a Password" minLength={8} maxLength={128} required/>
						</Field>
						<Field>
							<Label htmlFor="job-1">Job</Label>
							{/* name="job": sends the selected job with the form */}
							<SelectJob name="job" />
						</Field>
					</FieldGroup>
					{/* why the backend refused (email already used, ...) */}
					{state.error && (
						<p role="alert" className="text-sm text-destructive">{state.error}</p>
					)}
					<DialogFooter>
						<DialogClose render={<Button variant="outline">Cancel</Button>} />
						<Button type="submit" disabled={pending}>
							{pending ? "Creating..." : "Create profil"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
