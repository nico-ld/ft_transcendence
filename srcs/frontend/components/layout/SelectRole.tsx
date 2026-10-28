import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@/components/ui/select";
import { useTranslations } from "next-intl";
import { ROLES, type Role } from "@/types/User";

export function SelectRole({value = "user", name, id, disabled}: {value?: Role; name?: string; id?: string; disabled?: boolean;}) {
	const t = useTranslations("Header");

	const items = ROLES.map((role) => ({value: role, label: t(role)}));

	return (
		<Select
			key={value}
			name={name}
			items={items}
			defaultValue={value}
			disabled={disabled}
		>
			<SelectTrigger id={id} className="w-auto">
				<SelectValue />
			</SelectTrigger>
			<SelectContent>
				{items.map((item) => (
					<SelectItem key={item.value} value={item.value}>
						{item.label}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
