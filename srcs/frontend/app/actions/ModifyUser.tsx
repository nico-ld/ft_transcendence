import { Toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SelectJob } from "@/components/layout/SelectJob";
import { 
	Avatar,
	AvatarImage,
	AvatarFallback
} from "@/components/ui/avatar";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { User } from "@/lib/types";

type ModifyUserProps = {
	user: User;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function ModifyUser({user, open, onOpenChange}: ModifyUserProps) {
	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent>
				<div key={user.username} className="flex flex-col gap-4">
					<SheetHeader>
						<SheetTitle>
							<div className="flex flex-row gap-4 items-center">
								<Avatar>
									<AvatarImage src={user.avatar} />
									<AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
								</Avatar>
								<h1 className="font-bold">{user.lastname} {user.name}</h1>
							</div>
						</SheetTitle>
						<SheetDescription>
							Edit {user.username} profil.
						</SheetDescription>
					</SheetHeader>
					<Field>
						<Label htmlFor="lastname-1">LastName</Label>
						<Input id="lastname-1" name="lastname" defaultValue={user.lastname} />
					</Field>
					<Field>
						<Label htmlFor="name-1">Name</Label>
						<Input id="name-1" name="name" defaultValue={user.name} />
					</Field>
					<Field>
						<Label htmlFor="username-1">Username</Label>
						<Input id="username-1" name="username" defaultValue={user.username} />
					</Field>
					<Field>
						<Label htmlFor="job-1">Job</Label>
						<SelectJob value={user.job} name="job" />
					</Field>
					<SheetFooter>
						<Button type="submit">Save changes</Button>
						<SheetClose render={<Button variant="outline">Close</Button>} />
					</SheetFooter>
				</div>
			</SheetContent>
		</Sheet>
	);
}
