import { Button } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserRoundPlus } from "lucide-react";
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
import { 
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue
} from "@/components/ui/select";

import { Jobs } from "@/lib/jobs";

function SelectJob() {
	return (
		<Select items={Jobs}>
			<SelectTrigger className="w-full max-w-48">
				<SelectValue />
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
					<SelectLabel>Jobs</SelectLabel>
					{Jobs.map((item) => (
						<SelectItem key={item.value} value={item.value}>
							{item.label}
						</SelectItem>
					))}
				</SelectGroup>
			</SelectContent>
		</Select>
	);
}

export function NewUserForm() {
	return (
		<Dialog>
			<form>
				<DialogTrigger render={<Button variant="ghost" className="text-green-500"><UserRoundPlus /></Button>} />
				<DialogContent className="sm:max-w-sm">
					<DialogHeader>
						<DialogTitle>Add an User</DialogTitle>
						<DialogDescription>
							Enter information about the new user,
							a new session will be create.
						</DialogDescription>
					</DialogHeader>

					<FieldGroup>
						<Field>
							<Label htmlFor="lastname-1">LastName</Label>
							<Input id="lastname-1" name="lastname" placeholder="Enter the LastName"/>
						</Field>
						<Field>
							<Label htmlFor="name-1">Name</Label>
							<Input id="name-1" name="name" placeholder="Enter the name"/>
						</Field>
						<Field>
							<Label htmlFor="email-1">Email</Label>
							<Input id="email-1" name="email" type="email" placeholder="Enter the email"/>
						</Field>
						<Field>
							<Label htmlFor="password-1">Password</Label>
							<Input id="password-1" name="password" type="password" placeholder="Create a Password"/>
						</Field>
						<Field>
							<Label htmlFor="job-1">Job</Label>
							<SelectJob />
						</Field>
					</FieldGroup>
					<DialogFooter>
						<DialogClose render={<Button variant="outline">Cancel</Button>} />
						<Button type="submit">Save changes</Button>
					</DialogFooter>
				</DialogContent>
			</form>
		</Dialog>
	);
}
