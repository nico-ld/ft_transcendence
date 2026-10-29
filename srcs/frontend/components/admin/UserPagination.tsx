"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

type UserPaginationProps = {
	page: number;
	pages: number;
	total: number;
	onPageChange: (page: number) => void;
};

export function UserPagination({ page, pages, total, onPageChange }: UserPaginationProps) {
	const t = useTranslations("Users.page");

	return (
		<nav aria-label={t("label")} className="flex items-center justify-between gap-2 border-t px-2 pt-2 text-sm text-muted-foreground">
			<span aria-live="polite">{t("total", { count: total })}</span>
			<div className="flex items-center gap-1">
				<Button
					variant="ghost"
					size="icon-sm"
					aria-label={t("previous")}
					disabled={page <= 1}
					onClick={() => onPageChange(page - 1)}
				>
					<ChevronLeft />
				</Button>
				<span className="tabular-nums">{t("status", { page, pages })}</span>
				<Button
					variant="ghost"
					size="icon-sm"
					aria-label={t("next")}
					disabled={page >= pages}
					onClick={() => onPageChange(page + 1)}
				>
					<ChevronRight />
				</Button>
			</div>
		</nav>
	);
}
