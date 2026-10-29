import { useTranslations } from "next-intl";
import { Field } from "../ui/field";
import { Input } from "../ui/input";
import { UserFilter } from "./UserFilter";
import {
	Item,
	ItemContent,
	ItemGroup,
	ItemSeparator,
	ItemTitle,
} from "@/components/ui/item";
import type { UserFilterProps } from "@/types/UserList";

export function UsreToolBar(props: UserFilterProps) {
	const t = useTranslations("Users");
	const {filters, onFiltersChange} = props;

	return (
		<ItemGroup className="bg-card">
			<Item variant={"muted"}>
				<ItemContent>
					<ItemTitle>
						<Field orientation="horizontal">
							<UserFilter {...props} />
							<Input
								type="search"
								placeholder={t("searchBar")}
								value={filters.query}
								onChange={(e) => onFiltersChange({query: e.target.value})}
							/>
						</Field>
					</ItemTitle>
				</ItemContent>
			</Item>
			<ItemSeparator className="my-0 mb-2" />
		</ItemGroup>
	);
}
