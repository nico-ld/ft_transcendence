import type { FilterSubProps } from "@/types/UserList";
import {
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";

export function FilterSub<T extends string>({
	label,
	value,
	options,
	labelOf,
	countOf,
	onChange
}: FilterSubProps<T>) {
	return (
		<DropdownMenuSub>
			<DropdownMenuSubTrigger>
				{label}
				<span className="ml-auto pl-3 text-muted-foreground">{labelOf(value)}</span>
			</DropdownMenuSubTrigger>
			<DropdownMenuSubContent className="min-w-44">
				<DropdownMenuRadioGroup value={value} onValueChange={(v) => onChange(v as T)}>
					{options.map((option) => (
						<DropdownMenuRadioItem key={option} value={option}>
							{labelOf(option)}
							<span className="ml-auto pl-3 text-xs text-muted-foreground tabular-nums">
								{countOf(option)}
							</span>
						</DropdownMenuRadioItem>
					))}
				</DropdownMenuRadioGroup>
			</DropdownMenuSubContent>
		</DropdownMenuSub>
	);
}
