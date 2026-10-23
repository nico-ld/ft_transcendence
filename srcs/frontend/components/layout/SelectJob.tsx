import { 
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue
} from "@/components/ui/select";
import { useTranslations } from "next-intl";
import { JOBS } from "@/types/jobs";

export function SelectJob({value, name}: {value?: string | null; name?: string;}) {
	const t = useTranslations("Users.jobList");

	const items = [
		{value: null, label: t("placeholder")},
		...JOBS.map((job) => ({value: job, label: t(job)}))
	];

	return (
		<Select 
			key={value ?? "none"}
			name={name}
			items={items}
			defaultValue={value ?? null}
		>
			<SelectTrigger id="job-1" className="w-auto">
				<SelectValue />
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
					<SelectLabel>Jobs</SelectLabel>
					{items.map((item) => (
						<SelectItem key={item.value ?? "none"} value={item.value}>
							{item.label}
						</SelectItem>
					))}
				</SelectGroup>
			</SelectContent>
		</Select>
	);
}
