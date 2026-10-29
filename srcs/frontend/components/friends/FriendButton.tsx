"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { addFriend, removeFriend } from "@/actions/friends";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";

export function FriendButton({ userId, action, variant = "outline", success, children }: {
	userId: number;
	action: "add" | "remove";
	variant?: "default" | "outline" | "ghost";
	// toast shown when it worked none if not given
	success?: string;
	children: React.ReactNode;
}) {
	const [isPending, startTransition] = useTransition();
	const t = useTranslations("Friends");

	function onClick() {
		startTransition(async () => {
			const ok = await (action === "add" ? addFriend : removeFriend)(userId);
			if (!ok)
				toast.add({ type: "error", title: t("error") });
			else if (success)
				toast.add({ type: "success", title: success });
		});
	}

	return (
		<Button size="sm" variant={variant} disabled={isPending} onClick={onClick}>
			{isPending && <Spinner />}
			{children}
		</Button>
	);
}
