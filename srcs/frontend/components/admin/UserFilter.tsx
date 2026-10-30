import { Funnel } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { JOBS } from "@/types/jobs";
import { ROLES } from "@/types/User";
import { DEFAULT_ORDER } from "@/types/UserList";

import type { JobFilter, RoleFilter, SortOrder, SortKey } from "@/types/User";
import type { UserFilterProps } from "@/types/UserList";
import { FilterSub } from "./FilterSub";

export function UserFilter({sort, onSortChange, filters, onFiltersChange, count}: UserFilterProps) {
	const t = useTranslations("Users");
	const h = useTranslations("Header");

	const active = filters.role !== "all" || filters.job !== "all";
	const roleLabel = (role: RoleFilter) => role === "all" ? t("filter.all") : h(role);
	const jobLabel = (job: JobFilter) => job === "all" ? t("filter.all") : job === "none" ? t("noJob") : t(`jobList.${job}`);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger render={
				<Button variant="ghost" className="relative rounded-full hover:text-primary" aria-label={t("filter.label")}>
					<Funnel />
					{active && <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-primary" />}
				</Button>
			}
			/>
			<DropdownMenuContent className="w-56">
				<DropdownMenuGroup>
					<DropdownMenuLabel>{t("sort.label")}</DropdownMenuLabel>
					<DropdownMenuRadioGroup
						value={sort.key}
						onValueChange={(v) => onSortChange({key: v as SortKey, order: DEFAULT_ORDER[v as SortKey]})}
					>
						<DropdownMenuRadioItem value="date">{t("sort.date")}</DropdownMenuRadioItem>
						<DropdownMenuRadioItem value="username">{t("sort.username")}</DropdownMenuRadioItem>
						<DropdownMenuRadioItem value="email">{t("sort.email")}</DropdownMenuRadioItem>
					</DropdownMenuRadioGroup>
				</DropdownMenuGroup>

				<DropdownMenuSeparator />

				<DropdownMenuGroup>
					<DropdownMenuLabel>{t("sort.order")}</DropdownMenuLabel>
					<DropdownMenuRadioGroup 
						value={sort.key}
						onValueChange={(v) => onSortChange({...sort, order: v as SortOrder})}
					>
						<DropdownMenuRadioItem value="asc">{t("sort.asc")}</DropdownMenuRadioItem>
						<DropdownMenuRadioItem value="desc">{t("sort.desc")}</DropdownMenuRadioItem>
					</DropdownMenuRadioGroup>
				</DropdownMenuGroup>

				<DropdownMenuSeparator />

				<DropdownMenuGroup>
					<DropdownMenuLabel>{t("filter.title")}</DropdownMenuLabel>
					<FilterSub
						label={t("filter.role")}
						value={filters.role}
						options={["all", ...ROLES]}
						labelOf={roleLabel}
						countOf={(role) => count({role})}
						onChange={(role) => onFiltersChange({role})}
					/>
					<FilterSub
						label={t("filter.job")}
						value={filters.job}
						options={["all", ...JOBS, "none"]}
						labelOf={jobLabel}
						countOf={(job) => count({job})}
						onChange={(job) => onFiltersChange({job})}
					/>
				</DropdownMenuGroup>
				{active && (
					<>
						<DropdownMenuSeparator />
						<DropdownMenuItem onClick={() => onFiltersChange({role: "all", job: "all"})}>
							{t("filter.clear")}
						</DropdownMenuItem>
					</>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
