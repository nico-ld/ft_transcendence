import { Button } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserRoundPlus } from "lucide-react";
import { SelectJob } from "@/components/layout/SelectJob";
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

export function NewUserForm() {
	return (
		<Dialog>
			<form>
				<DialogTrigger render={<Button variant="ghost" className="text-green-500"><UserRoundPlus /></Button>} />
				<DialogContent className="sm:max-w-sm">
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
							<Input id="password-1" name="password" type="password" placeholder="Create a Password" required/>
						</Field>
						<Field>
							<Label htmlFor="job-1">Job</Label>
							<SelectJob />
						</Field>
					</FieldGroup>
					<DialogFooter>
						<DialogClose render={<Button variant="outline">Cancel</Button>} />
						<Button type="submit">Create profil</Button>
					</DialogFooter>
				</DialogContent>
			</form>
		</Dialog>
	);
}
