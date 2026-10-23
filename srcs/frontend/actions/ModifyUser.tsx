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
import { Field } from "@/components/ui/field";
import type { ModifyUserProps } from "@/types/ModifyUserProps";
import { useTranslations } from "next-intl";

export function ModifyUser({user, open, onOpenChange}: ModifyUserProps) {
	const t = useTranslations("Users");
	const c = useTranslations("Common");

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
						<SheetDescription>{t("editProfil", {username: user.username})}</SheetDescription>
					</SheetHeader>
					<Field>
						<Label htmlFor="lastname-1">{t("userInfo.lastName")}</Label>
						<Input id="lastname-1" name="lastname" defaultValue={user.lastname} />
					</Field>
					<Field>
						<Label htmlFor="name-1">{t("userInfo.name")}</Label>
						<Input id="name-1" name="name" defaultValue={user.name} />
					</Field>
					<Field>
						<Label htmlFor="username-1">{t("userInfo.userName")}</Label>
						<Input id="username-1" name="username" defaultValue={user.username} />
					</Field>
					<Field>
						<Label htmlFor="job-1">{t("userInfo.job")}</Label>
						<SelectJob value={user.job} name="job" />
					</Field>
					<SheetFooter>
						<Button type="submit">{c("saveChanges")}</Button>
						<SheetClose render={<Button variant="outline">{c("close")}</Button>} />
					</SheetFooter>
				</div>
			</SheetContent>
		</Sheet>
	);
}
