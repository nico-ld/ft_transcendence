import { WorkspaceView } from "@/components/workspace/WorkspaceView";

// /workspace: the page the "Working space" button of /user links to
// (components/dashboard/WorkspaceLink.tsx). Everything is in WorkspaceView,
// which runs in the browser.
export default function WorkspacePage() {
	return <WorkspaceView />;
}
