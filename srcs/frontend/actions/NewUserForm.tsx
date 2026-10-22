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
import { useTranslations } from "next-intl";

export function NewUserForm() {
	const t = useTranslations("Users");
	const c = useTranslations("Common");
	const l = useTranslations("Login");

	return (
		<Dialog>
			<form>
				<DialogTrigger render={<Button variant="ghost" className="text-green-500"><UserRoundPlus /></Button>} />
				<DialogContent className="sm:max-w-sm">
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
							<Input id="password-1" name="password" type="password" placeholder={t("create.phPassword")} required/>
						</Field>
						<Field>
							<Label htmlFor="job-1">{t("userInfo.job")}</Label>
							<SelectJob />
						</Field>
					</FieldGroup>
					<DialogFooter>
						<DialogClose render={<Button variant="outline">{c("cancel")}</Button>} />
						<Button type="submit">{c("create")}</Button>
					</DialogFooter>
				</DialogContent>
			</form>
		</Dialog>
	);
}
