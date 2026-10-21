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

export function SelectJob({value, name}: {value?: string | null; name?: string;}) {
	return (
		<Select 
			key={value ?? "none"}
			name={name}
			items={Jobs}
			defaultValue={value ?? null}
		>
			<SelectTrigger id="job-1" className="w-full max-w-48">
				<SelectValue />
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
					<SelectLabel>Jobs</SelectLabel>
					{Jobs.map((item) => (
						<SelectItem key={item.value ?? "none"} value={item.value}>
							{item.label}
						</SelectItem>
					))}
				</SelectGroup>
			</SelectContent>
		</Select>
	);
}
