"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ChartLine, ExternalLink } from "lucide-react";
import { Button, buttonVariants } from "../ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "../ui/dialog";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "../ui/select";

// uid in srcs/grafana/provisioning/dashboards/admin-metrics.json
const DASHBOARD_UID = "admin-metrics";

type WorkspaceUser = { id: number; username: string };

// users -> the accounts that have a workspace (a job) picked in the dialog
export function GrafanaModal({ users }: { users: WorkspaceUser[] }) {
	const t = useTranslations("Stats");
	const [open, setOpen] = useState(false);
	const [userId, setUserId] = useState<number | null>(users[0]?.id ?? null);
	const dashboard = `/grafana/d/${DASHBOARD_UID}?var-user_id=${userId ?? ""}`;
	const items = users.map((user) => ({ value: user.id, label: user.username }));

	return (
		<>
			<Button variant="outline" className="h-11 w-full" onClick={() => setOpen(true)}>
				<ChartLine />
				{t("grafana")}
			</Button>

			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent className="flex h-[90vh] w-[95vw] flex-col sm:max-w-6xl">
					<DialogHeader className="flex-row flex-wrap items-center gap-3 pr-10">
						<DialogTitle className="mr-auto">{t("grafanaTitle")}</DialogTitle>
						{users.length > 0 && (
							<Select items={items} value={userId} onValueChange={(value) => setUserId(value)}>
								<SelectTrigger aria-label={t("grafanaUser")} className="w-48">
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
						)}
						<a
							href={dashboard}
							target="_blank"
							rel="noopener noreferrer"
							className={buttonVariants({ variant: "ghost", size: "sm" })}
						>
							{t("grafanaNewTab")}
							<ExternalLink />
						</a>
					</DialogHeader>

					{users.length > 0 ? (
						<iframe
							src={`${dashboard}&kiosk`}
							title={t("grafanaTitle")}
							className="min-h-0 w-full flex-1 rounded-lg border"
						/>
					) : (
						<p className="m-auto text-muted-foreground">{t("grafanaEmpty")}</p>
					)}
				</DialogContent>
			</Dialog>
		</>
	);
}
