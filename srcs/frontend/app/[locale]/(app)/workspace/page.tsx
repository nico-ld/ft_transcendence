import { Suspense } from "react";
import { getLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { WorkspaceView } from "@/components/workspace/WorkspaceView";
import { getCurrentUser } from "@/lib/backend";
import { pageMetadata } from "@/lib/metadata";

export function generateMetadata() {
	return pageMetadata("workspace");
}

// /workspace: the page the "Working space" button of /user links to
// (components/dashboard/WorkspaceLink.tsx).
export default function WorkspacePage() {
	return (
		<Suspense fallback={null}>
			<Workspace />
		</Suspense>
	);
}

// reads the session, so it renders at request time, inside the Suspense above
async function Workspace() {
	const [user, locale] = await Promise.all([getCurrentUser(), getLocale()]);

	if (!user)
		return redirect({ href: "/login", locale });

	return <WorkspaceView user={user} />;
}
